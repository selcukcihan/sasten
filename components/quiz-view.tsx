'use client'

import { useEffect, useState } from "react"
import { QuestionsView } from "./questions-view"
import { QuizHeader } from "./quiz-header"
import { getToday } from "../core/date"
import { Quiz, QuizSubmission } from "../core/db"
import { getQuizDetails } from "../app/actions"

export default function QuizView(props: any) {
  const todaysQuiz = props.quiz as Quiz | null
  const todaysQuizSubmission = props.userQuiz as QuizSubmission | null

  const [quiz, setQuiz] = useState<Quiz | null>(todaysQuiz)
  const [userQuiz, setUserQuiz] = useState<QuizSubmission | null>(todaysQuizSubmission)
  const [date, setDate] = useState(getToday())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function initData() {
      if (!(quiz?.date === date && (!userQuiz || userQuiz.date === date))) {
        const quizDetails = await getQuizDetails(date)
        setQuiz(quizDetails.quiz)
        setUserQuiz(quizDetails.userQuiz) 
      }
    }
    initData()
    setLoading(quiz?.date !== date)
  }, [date, quiz, userQuiz])

  return (
    <>
      <QuizHeader {...props} {...{ loading, setLoading, date, setDate }} />
      <QuestionsView {...props} {...{ quiz, userQuiz, setUserQuiz, loading, setLoading, date, setDate }}/>
      <LoadingView loading={loading} date={date} />
    </>
  )
}

function LoadingView(props: any) {
  const { loading, date } = props
  if (!loading) return null
  return (
    <main className={`flex-1 lg:bg-gray-100 dark:bg-gray-800 p-4 lg:p-8 flex items-center justify-center cursor-wait`}>
      <div className="animate-pulse text-2xl font-bold text-gray-900 dark:text-gray-100">Loading quiz...</div>
    </main>
  )
}
