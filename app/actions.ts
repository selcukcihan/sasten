'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signIn, signOut } from "../auth"
import { completeQuiz, getQuiz, Quiz, getUsersQuiz, getTodaysQuiz } from '../core/db';
import { getToday } from '../core/date';

export async function submitQuiz(quiz: Quiz, answers: number[], currentTotalScore: number) {
  const session = await auth()
  if (session?.user?.id) {
    await completeQuiz(session.user, quiz.date, answers, answers.filter((ans, idx) => ans === quiz.questions[idx].answer).length, currentTotalScore)
    redirect('/')
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
    return { quiz, userQuiz }
  } else {
    const quiz = await getTodaysQuiz()
    return { quiz, userQuiz: null }
  }
}
