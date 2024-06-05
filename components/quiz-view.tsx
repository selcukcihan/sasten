'use client'

import { useEffect, useState } from "react"
import { QuestionsView } from "./questions-view"
import { QuizHeader } from "./quiz-header"
import { getToday } from "../core/date"
import { Quiz, QuizSubmission, User } from "../core/db"
import { getQuizDetails } from "../app/actions"

export default function QuizView(props: any) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [userQuiz, setUserQuiz] = useState<QuizSubmission | null>(null)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(getToday())

  useEffect(() => {
    async function initData() {
      const { quiz, userQuiz } = await getQuizDetails(date)
      setQuiz(quiz)
      setUserQuiz(userQuiz)
    }
    initData()
  }, [date])

  return (
    <>
      <QuizHeader {...props} {...{ loading, setLoading, date, setDate }} />
      {quiz && <QuestionsView {...props} {...{ quiz, userQuiz, loading, setLoading, date, setDate }}/>}
    </>
  )
}
