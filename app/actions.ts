'use server'

import { auth } from '@/auth'
import { signIn, signOut } from "../auth"
import { completeQuiz, getQuiz, Quiz, getUsersQuiz, getTodaysQuiz } from '../core/db'
import { getToday } from '../core/date'

export async function submitQuiz(quiz: Quiz, answers: number[]) {
  if (answers.length !== quiz.questions.length) {
    throw new Error('Invalid number of answers')
  }
  const session = await auth()
  if (session?.user?.id) {
    await completeQuiz(session.user, quiz.date, answers, answers.filter((ans, idx) => ans === quiz.questions[idx].answer).length)
    return await getUsersQuiz(session.user.id, quiz.date)
  }
}

export async function submitSignIn() {
  await signIn("google")
}

export async function submitSignOut() {
  await signOut()
}

export async function getQuizDetails(date?: string) {
  const session = await auth()
  if (session?.user?.id) {
    const _date = date || getToday()
    const [quiz, userQuiz] = await Promise.all([getQuiz(_date), getUsersQuiz(session.user.id, _date)])
    if (!quiz) {
      throw new Error(`Quiz ${_date} not found`)
    }
    return { quiz, userQuiz }
  } else {
    const quiz = await getTodaysQuiz()
    return { quiz, userQuiz: null }
  }
}
