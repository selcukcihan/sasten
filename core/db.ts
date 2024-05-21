
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"

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

export const getTodaysQuiz = async () => {
  const today = new Date().toISOString().split('T')[0]
  const quiz = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `QUIZ#${today}`,
      sk: `QUIZ`,
    },
  }))
  return quiz.Item
}

export const completeQuiz = async (userId: string, date: string, answers: number[], score: number) => {
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Item: {
      pk: `USER#${userId}`,
      sk: `QUIZ#${date}`,
      answers,
      score
    },
  })

  await docClient.send(command)
}

export const getUsersQuiz = async (userId: string, date: string): Promise<QuizSubmission | null> => {
  const quiz = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME || '',
    Key: {
      pk: `USER#${userId}`,
      sk: `QUIZ#${date}`,
    },
  }))
  return quiz.Item as QuizSubmission
}
