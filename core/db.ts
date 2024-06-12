
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, QueryCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb"
import { LEADER_BOARD_NUMBER_OF_USERS } from "./constants"
import sampleData from './data.json'
import { User as AuthUser } from 'next-auth'
import { getToday } from "./date"

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
  isAdmin?: boolean
}

export interface DetailedUser extends User {
  name: string
}

export interface LeaderBoardUser {
  score: number
  userId: string
  name: string
}

export const getDefaultQuiz = (date?: string): Quiz => ({
  date: date || getToday(),
  questions: sampleData,
})

let todaysQuiz: Quiz | null = null

export const getQuiz = async (date: string) => {
  const response = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `QUIZ#${date}`,
      sk: `QUIZ`,
    },
  }))
  return response.Item ? response.Item as Quiz : null
}

export const getTodaysQuiz = async () => {
  const today = getToday()
  if (todaysQuiz && todaysQuiz.date === today) {
    return todaysQuiz
  }

  const quiz = await getQuiz(today)
  // If we forgot to add the quiz for today, let's just return the sample quiz
  if (quiz) {
    todaysQuiz = quiz
    return quiz
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
      KeyConditionExpression: 'GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)',
      ExpressionAttributeValues: {
        ':GSI1PK': 'LEADER_BOARD',
        ':GSI1SK': 'SCORE#',
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
    KeyConditionExpression: 'GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)',
    ExpressionAttributeValues: {
      ':GSI1PK': 'LEADER_BOARD',
      ':GSI1SK': 'SCORE#',
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

export const completeQuiz = async (user: AuthUser, date: string, answers: number[], score: number) => {
  console.log(`${user.id} completing quiz for ${date}`)
  const _user = await getUser(user.id || '')
  if (!_user) {
    throw new Error(`User ${user.id} not found`)
  }
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
            GSI1PK: {
              S: `SUBMISSION#${date}`,
            },
            GSI1SK: {
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
          UpdateExpression: 'ADD score :score, gamesPlayed :gamesPlayed  SET GSI1PK = :GSI1PK, GSI1SK = :GSI1SK, email = :email, #userName = :userName',
          ExpressionAttributeValues: {
            ':score': {
              N: score.toString(),
            },
            ':gamesPlayed': {
              N: '1',
            },
            ':GSI1PK': {
              S: `LEADER_BOARD`,
            },
            ':GSI1SK': {
              S: `SCORE#${(_user.score + score).toString().padStart(10, '0')}#${user.id}`,
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

export const getUsersQuiz = async (userId: string, date: string): Promise<QuizSubmission | null> => {
  const response = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `QUIZ#${date}`,
    },
  }))
  return response.Item ? {
    date,
    answers: response.Item.answers,
    score: response.Item.score,
  } : null
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
      isAdmin: quizUser.length ? !!(quizUser[0].isAdmin) : false,
    }
  } else {
    return null
  }
}

export const getUserQuizzes = async (userId: string): Promise<QuizSubmission[]> => {
  const response = await docClient.send(new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'QUIZ#',
    },
    ScanIndexForward: false,
  }))
  return (response.Items || []).map((item) => ({
    date: item.sk.split('#')[1],
    answers: item.answers,
    score: item.score,
  }))
}

export const getAllUsers = async (): Promise<DetailedUser[]> => {
  let lastEvaluatedKey = undefined
  let allUsers: DetailedUser[] = []
  do {
    const response: any = await docClient.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)',
      ExpressionAttributeValues: {
        ':GSI1PK': 'LEADER_BOARD',
        ':GSI1SK': 'SCORE#',
      },
      ExclusiveStartKey: lastEvaluatedKey,
    }))
    allUsers = allUsers.concat((response.Items || []).map((item: any) => ({
      score: item.score,
      id: item.pk.split('#')[1],
      name: item.name,
      email: item.email,
      gamesPlayed: item.gamesPlayed,
    })))
    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)
  return allUsers
}

const getAllAuthUsersOf = async (provider: string): Promise<string[]> => {
  let lastEvaluatedKey = undefined
  let allUsers: string[] = []
  do {
    const response: any = await docClient.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)',
      ExpressionAttributeValues: {
        ':GSI1PK': `ACCOUNT#${provider}`,
        ':GSI1SK': 'ACCOUNT#',
      },
      ExclusiveStartKey: lastEvaluatedKey,
    }))
    allUsers = allUsers.concat((response.Items || []).map((item: any) => item.userId as string))
    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)
  return allUsers
}

export const getAllAuthUsers = async (): Promise<string[]> => {
  return (await Promise.all(['google', 'github'].map(getAllAuthUsersOf))).flat()
}

export interface QuizDetails {
  date: string
  completedUsers: number
  averageScore: number
  questions: {
    text: string
    correctAnswers: number
    incorrectAnswers: number
  }[]
}

export const getAllSubmissionsForQuiz = async (date: string): Promise<QuizSubmission[]> => {
  let lastEvaluatedKey = undefined
  let allSubmissions: QuizSubmission[] = []
  do {
    const response: any = await docClient.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :GSI1PK and begins_with(GSI1SK, :GSI1SK)',
      ExpressionAttributeValues: {
        ':GSI1PK': `SUBMISSION#${date}`,
        ':GSI1SK': 'USER#',
      },
      ExclusiveStartKey: lastEvaluatedKey,
    }))
    allSubmissions = allSubmissions.concat((response.Items || []).map((item: any) => ({
      date,
      answers: item.answers,
      score: item.score,
    })))
    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)
  return allSubmissions
}

export const getOverallPerformance = async (): Promise<QuizDetails[]> => {
  const lastDates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  })

  const lastQuizzes: Quiz[] = (await Promise.all(lastDates.map((date) => getQuiz(date)))).filter((quiz) => quiz) as Quiz[]
  const lastSubmissions: QuizSubmission[][] = []
  for (const quiz of lastQuizzes) {
    lastSubmissions.push(await getAllSubmissionsForQuiz(quiz.date))
  }

  // Filter out quizzes that don't have submissions
  const validIndices = lastSubmissions.map((submissions) => submissions.length > 0)

  return lastQuizzes.map((quiz, i) => {
    if (!validIndices[i]) {
      return null
    }
    const submissions = lastSubmissions[i]
    const questions = quiz.questions.map((question, j) => {
      const correctAnswers = submissions.filter((submission) => submission.answers[j] === question.answer).length
      return {
        text: question.question,
        correctAnswers,
        incorrectAnswers: submissions.length - correctAnswers,
      }
    })
    return {
      date: quiz.date,
      completedUsers: submissions.length,
      averageScore: submissions.reduce((prev, curr) => prev + curr.score, 0) / submissions.length,
      questions,
    }
  }).filter((quiz) => quiz) as QuizDetails[]
}
