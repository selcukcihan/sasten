
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, UpdateCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb"
import { LEADER_BOARD_NUMBER_OF_USERS } from "./constants"
import sampleData from './data.json'
import { User as AuthUser } from 'next-auth'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export interface Question {
  question: string
  options: string[]
  answer: number
}

export interface Quiz {
  date: string
  questions: Question[]
}

export interface QuizSubmission {
  date: string
  answers: number[]
  score: number
}

export interface User {
  id: string
  email: string
  score: number
  gamesPlayed: number
}

export interface LeaderBoardUser {
  score: number
  userId: string
  name: string
}

export const getDefaultQuiz = (date?: string): Quiz => ({
  date: date || new Date().toISOString().split('T')[0],
  questions: sampleData,
})

let todaysQuiz: Quiz | null = null

export const getTodaysQuiz = async () => {
  const today = new Date().toISOString().split('T')[0]
  if (todaysQuiz && todaysQuiz.date === today) {
    return todaysQuiz
  }

  const response = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `QUIZ#${today}`,
      sk: `QUIZ`,
    },
  }))
  // If we forgot to add the quiz for today, let's just return the sample quiz
  if (response.Item) {
    todaysQuiz = response.Item as Quiz
    return todaysQuiz
  } else {
    return getDefaultQuiz(today)
  }
}

export const getAllScores = async (): Promise<LeaderBoardUser[]> => {
  let lastEvaluatedKey = undefined
  let allScores: LeaderBoardUser[] = []
  do {
    const response: any = await docClient.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk and begins_with(GSI1SK, :gsi1sk)',
      ExpressionAttributeValues: {
        ':gsi1pk': 'LEADER_BOARD',
        ':gsi1sk': 'SCORE#',
      },
      ScanIndexForward: false,
      ExclusiveStartKey: lastEvaluatedKey,
    }))
    allScores = allScores.concat((response.Items || []).map((item: any) => ({
      score: item.score,
      userId: item.pk.split('#')[1],
      name: item.name,
    })))
    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)
  return allScores
}

export const getTopScores = async (): Promise<LeaderBoardUser[]> => {
  const response = await docClient.send(new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :gsi1pk and begins_with(GSI1SK, :gsi1sk)',
    ExpressionAttributeValues: {
      ':gsi1pk': 'LEADER_BOARD',
      ':gsi1sk': 'SCORE#',
    },
    ScanIndexForward: false,
    Limit: LEADER_BOARD_NUMBER_OF_USERS,
  }))
  return (response.Items || []).map((item) => ({
    score: item.score,
    userId: item.pk.split('#')[1],
    name: item.name,
  }))
}

export const completeQuiz = async (user: AuthUser, date: string, answers: number[], score: number, currentTotalScore: number) => {
  await docClient.send(new TransactWriteItemsCommand({
    TransactItems: [
      {
        Put: {
          TableName: process.env.DYNAMODB_TABLE_NAME || '',
          Item: {
            pk: {
              S: `USER#${user.id}`,
            },
            sk: {
              S: `QUIZ#${date}`,
            },
            answers: {
              L: answers.map((answer) => ({ N: answer.toString() })),
            },
            score: {
              N: score.toString(),
            },
            gsi1pk: {
              S: `SUBMISSION#${date}`,
            },
            gsi1sk: {
              S: `USER#${user.id}`,
            },
          },
          ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)',
        },
      },
      {
        Update: {
          TableName: process.env.DYNAMODB_TABLE_NAME || '',
          Key: {
            pk: {
              S: `USER#${user.id}`,
            },
            sk: {
              S: `QUIZ_USER#${user.id}`,
            },
          },
          ExpressionAttributeNames: {
            '#userName': 'name',
          },
          UpdateExpression: 'ADD score :score, gamesPlayed :gamesPlayed  SET GSI1PK = :gsi1pk, GSI1SK = :gsi1sk, email = :email, #userName = :userName',
          ExpressionAttributeValues: {
            ':score': {
              N: score.toString(),
            },
            ':gamesPlayed': {
              N: '1',
            },
            ':gsi1pk': {
              S: `LEADER_BOARD`,
            },
            ':gsi1sk': {
              S: `SCORE#${(currentTotalScore + score).toString().padStart(10, '0')}#${user.id}`,
            },
            ':email': {
              S: user.email || '',
            },
            ':userName': {
              S: user.name || '',
            },
          },
        },
      },
    ],
  }))
}

export const completeQuizWithoutTransactionUnsafe = async (user: AuthUser, date: string, answers: number[], score: number, currentTotalScore: number) => {
  const incrementUsersScore = async (score: number, currentTotalScore: number) => {
    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        pk: `USER#${user.id}`,
        sk: `QUIZ_USER#${user.id}`,
      },
      ExpressionAttributeNames: {
        '#userName': 'name',
      },
      UpdateExpression: 'ADD score :score, gamesPlayed :gamesPlayed  SET GSI1PK = :gsi1pk, GSI1SK = :gsi1sk, email = :email, #userName = :userName',
      ExpressionAttributeValues: {
        ':score': score,
        ':gamesPlayed': 1,
        ':gsi1pk': `LEADER_BOARD`,
        ':gsi1sk': `SCORE#${(currentTotalScore + score).toString().padStart(10, '0')}#${user.id}`,
        ':email': user.email || '',
        ':userName': user.name || '',
      },
    })

    await docClient.send(command)
  }

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${user.id}`,
      sk: `QUIZ#${date}`,
      answers,
      score,
      gsi1pk: `SUBMISSION#${date}`,
      gsi1sk: `USER#${user.id}`,
    },
  })

  // Also increment user's score in the main record
  await Promise.all([docClient.send(command), incrementUsersScore(score, currentTotalScore)])
}

export const getUsersQuiz = async (userId: string, date: string): Promise<QuizSubmission | null> => {
  const response = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `QUIZ#${date}`,
    },
  }))
  return response.Item as QuizSubmission
}

const isAuthUserRecord = (userId: string, item: any): boolean => {
  return item.pk === `USER#${userId}` && item.sk === `USER#${userId}`
}

const isQuizUserRecord = (userId: string, item: any): boolean => {
  return item.pk === `USER#${userId}` && item.sk === `QUIZ_USER#${userId}`
}

export const getUser = async (userId: string): Promise<User | null> => {
  const userRecords = ((await docClient.send(new BatchGetCommand({
    RequestItems: {
      [process.env.DYNAMODB_TABLE_NAME || '']: {
        Keys: [
          {
            pk: `USER#${userId}`,
            sk: `USER#${userId}`,
          },
          {
            pk: `USER#${userId}`,
            sk: `QUIZ_USER#${userId}`,
          },
        ],
      },
    },
  }))).Responses || {})[process.env.DYNAMODB_TABLE_NAME || '']
  if (userRecords) {
    const authUser = userRecords.filter((item) => isAuthUserRecord(userId, item))
    const quizUser = userRecords.filter((item) => isQuizUserRecord(userId, item))
    return {
      id: userId,
      email: authUser[0].email,
      score: quizUser.length ? quizUser[0].score : 0,
      gamesPlayed: quizUser.length ? quizUser[0].gamesPlayed : 0,
    }
  } else {
    return null
  }
}
