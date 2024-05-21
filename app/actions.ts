import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { completeQuiz, Quiz } from '../core/db';

export async function submitQuiz(quiz: Quiz, answers: number[]) {
  const session = await auth()
  if (session && session.user?.id) {
    await completeQuiz(session.user?.id, quiz.date, answers, answers.filter((ans, idx) => ans === quiz.questions[idx].answer).length)
  }
  redirect('/')
}
