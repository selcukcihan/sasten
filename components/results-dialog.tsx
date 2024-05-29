'use client'

import { useEffect, useState } from "react"
import { QuizSubmission } from "../core/db"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

const getOutcome = (userQuiz: QuizSubmission) => {
  if (!userQuiz) return
  const totalQuestions = userQuiz.answers.length
  switch (userQuiz.score) {
    case 0:
      return 'Oops! You missed all the questions.'
    case totalQuestions:
      return 'Excellent! You got it all correct.'
    case totalQuestions - 1:
      return 'Great job! You only missed one.'
    case totalQuestions - 2:
      return 'Nice try! You missed two questions.'
    default:
      return 'Not so bad, better luck next time!'
  }
}

export function ResultsDialog(props: any) {
  const userQuiz = props.userQuiz as QuizSubmission | undefined
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const outcome = userQuiz ? getOutcome(userQuiz) : ''

  useEffect(() => {
    if (userQuiz && !shown) {
      setOpen(true)
      setShown(true)
    }
  }, [userQuiz, shown])

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md dark:text-white dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>{outcome}</DialogTitle>
          <DialogDescription>Come back tomorrow for the next quiz!</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Your Score</h3>
            <p className="text-4xl font-bold">{userQuiz?.score} / {userQuiz?.answers.length}</p>
          </div>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
