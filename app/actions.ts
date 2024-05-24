'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signIn } from "../auth"
import { completeQuiz, Quiz } from '../core/db';

export async function submitQuiz(quiz: Quiz, answers: number[], currentTotalScore: number) {
  const session = await auth()
  if (session && session.user?.id) {
    await completeQuiz(session.user, quiz.date, answers, answers.filter((ans, idx) => ans === quiz.questions[idx].answer).length, currentTotalScore)
  }
  redirect('/')
}

export async function submitSignIn() {
  return await signIn("google")
}
