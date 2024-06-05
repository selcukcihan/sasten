'use client'

import { useEffect, useState } from "react"
import { QuestionsView } from "./questions-view"
import { QuizHeader } from "./quiz-header"
import { getToday } from "../core/date"
import { Quiz, QuizSubmission } from "../core/db"
import { getQuizDetails } from "../app/actions"

export default function QuizView(props: any) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [userQuiz, setUserQuiz] = useState<QuizSubmission | null>(null)
  const [date, setDate] = useState(getToday())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function initData() {
      const quizDetails = await getQuizDetails(date)
      setQuiz(quizDetails.quiz)
      setUserQuiz(quizDetails.userQuiz)
      setLoading(quizDetails.quiz?.date !== date)
    }
    initData()
  }, [date])

  const isLoading = loading || !quiz

  return (
    <>
      <QuizHeader {...props} {...{ loading, setLoading, date, setDate }} />
      {!isLoading && <QuestionsView {...props} {...{ quiz, userQuiz, loading, setLoading, date, setDate }}/>}
      {isLoading && <LoadingView date={date} />}
    </>
  )
}

function LoadingView(props: any) {
  return (
    <main className={`flex-1 lg:bg-gray-100 dark:bg-gray-800 p-4 lg:p-8 flex items-center justify-center cursor-wait`}>
      <div className="animate-pulse text-2xl font-bold text-gray-900 dark:text-gray-100">Loading quiz...</div>
    </main>
  )
}
