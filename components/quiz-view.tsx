'use client'

import { useState } from "react"
import { QuestionsView } from "./questions-view"
import { QuizHeader } from "./quiz-header"

export default function QuizView(props: any) {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <QuizHeader {...props} loading={loading} setLoading={setLoading} />
      <QuestionsView {...props} loading={loading} setLoading={setLoading}/>
    </>
  )
}
