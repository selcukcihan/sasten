
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { LEADER_BOARD_NUMBER_OF_USERS } from "./constants"
import sampleData from './data.json'

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

export const getTodaysQuiz = async () => {
  const today = new Date().toISOString().split('T')[0]
  const response = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `QUIZ#${today}`,
      sk: `QUIZ`,
    },
  }))
  // If we forgot to add the quiz for today, let's just return the sample quiz
  return response.Item ? response.Item as Quiz : ({
    date: today,
    questions: sampleData,
  })
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
    userId: item.id,
    name: item.name,
  }))
}

export const completeQuiz = async (userId: string, date: string, answers: number[], score: number, currentTotalScore: number) => {
  const incrementUsersScore = async (userId: string, score: number, currentTotalScore: number) => {
    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || '',
      Key: {
        pk: `USER#${userId}`,
        sk: `USER#${userId}`,
      },
      UpdateExpression: 'ADD score :score, gamesPlayed :gamesPlayed  SET GSI1PK = :gsi1pk, GSI1SK = :gsi1sk',
      ExpressionAttributeValues: {
        ':score': score,
        ':gamesPlayed': 1,
        ':gsi1pk': `LEADER_BOARD`,
        ':gsi1sk': `SCORE#${(currentTotalScore + score).toString().padStart(10, '0')}#${userId}`,
      },
    })

    await docClient.send(command)
  }

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${userId}`,
      sk: `QUIZ#${date}`,
      answers,
      score,
      gsi1pk: `SUBMISSION#${date}`,
      gsi1sk: `USER#${userId}`,
    },
  })

  // Also increment user's score in the main record
  await Promise.all([docClient.send(command), incrementUsersScore(userId, score, currentTotalScore)])
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

export const getUser = async (userId: string): Promise<User | null> => {
  const response = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
  }))
  return response.Item as User
}
