'use client'

import { useEffect, useState } from "react"
import { QuizSubmission } from "../core/db"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import Link from "next/link"
import { Leaderboard } from "./leaderboard"

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

const getTweetShareLink = (userQuiz?: QuizSubmission) => {
  const totalQuestions = userQuiz?.answers.length
  const score = userQuiz?.score
  const url = 'https://quiz.selcukcihan.com'
  return `https://twitter.com/intent/tweet?text=I just scored ${score} out of ${totalQuestions} on this quiz! Try it out at ${url}&hashtags=DevQuiz`
}

export function ResultsDialog(props: any) {
  const userQuiz = props.userQuiz as QuizSubmission | undefined
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const outcome = userQuiz ? getOutcome(userQuiz) : ''
  const displayingTodaysQuiz = props.displayingTodaysQuiz !== false

  useEffect(() => {
    if (userQuiz && !shown && displayingTodaysQuiz) {
      setOpen(true)
      setShown(true)
    }
  }, [userQuiz, shown, displayingTodaysQuiz])

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
          <div className="flex items-center space-x-4">
            <Link href={getTweetShareLink(userQuiz)} target='_blank'>
              <Button variant="outline">
                <TwitterIcon className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
            </Link>
          </div>
        </div>
        <Leaderboard {...props} />
      </DialogContent>
    </Dialog>
  )
}

function TwitterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}