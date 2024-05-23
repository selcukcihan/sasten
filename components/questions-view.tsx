'use client'

/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/pxp4wmTYZ52
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/

import { Session } from "next-auth"
import { Quiz, QuizSubmission, User } from '../core/db'
import { useState } from "react"
import { submitQuiz } from "../app/actions"

export function QuestionsView(props: any) {
  const session = props.session as (Session | null)
  const quiz = props.quiz as Quiz
  const user = props.user as User | undefined
  const userQuiz = props.userQuiz as QuizSubmission | undefined
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(userQuiz?.answers ||  quiz.questions.map(() => -1))
  const [submitted, setSubmitted] = useState(!!userQuiz)

  const getOutcome = () => {
    if (!userQuiz) return
    const totalQuestions = userQuiz.answers.length
    switch (userQuiz.score) {
      case 0:
        return 'Oops! You missed all the questions.'
      case totalQuestions:
        return 'Excellent! You got all the questions right.'
      case totalQuestions - 1:
        return 'Great job! You only missed one question.'
      case totalQuestions - 2:
        return 'Nice try! You missed two questions.'
      default:
        return 'Not so bad, better luck next time!'
    }
  }

  enum OptionButtonState {
    Unanswered,
    Answered,
    Correct,
    Incorrect,
  }

  const getOptionClassName = (optionButtonState: OptionButtonState) => {
    const others = "rounded-lg py-3 px-6 dark:text-gray-200 transition-colors"
    switch (optionButtonState) {
      case OptionButtonState.Answered:
        return `bg-green-400 dark:bg-green-700 ${others}`
      case OptionButtonState.Correct:
        return `bg-green-500 dark:bg-green-700 ${others}`
      case OptionButtonState.Incorrect:
        return `bg-orange-400 dark:bg-orange-800 ${others}`
      default:
        return `bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 ${others}`
    }
  }

  const getOptionButton = (answer: string, optionIndex: number) => {
    let optionButtonState = OptionButtonState.Unanswered
    if (userQuiz) {
      if (answers[currentQuestion] === optionIndex) {
        if (optionIndex === quiz.questions[currentQuestion].answer) {
          optionButtonState = OptionButtonState.Correct
        } else {
          optionButtonState = OptionButtonState.Incorrect
        }
      } else if (optionIndex === quiz.questions[currentQuestion].answer) {
        optionButtonState = OptionButtonState.Correct
      }
    } else if (answers[currentQuestion] === optionIndex) {
      optionButtonState = OptionButtonState.Answered
    }
    return (
      <button key={optionIndex} onClick={() => setAnswers(answers.map((ans, i) => i === currentQuestion ? optionIndex : ans))}
              className={getOptionClassName(optionButtonState)}>
        {answer}
      </button>
    )
  }

  const getNavigationButtonClassName = (disabled: boolean) => {
    const others = " rounded-lg py-3 px-6 transition-colors w-24"
    if (!disabled) {
      return "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" + others
    } else {
      return "bg-gray-100 dark:bg-gray-800 dark:text-gray-400" + others
    }
  }

  return (
    <main className={`flex-1 bg-gray-100 dark:bg-gray-800 p-4 lg:p-8 flex flex-col items-center justify-center`}>
      {userQuiz && <div className="dark:text-white py-4 px-6 text-center">
        <h3 className="text-base font-bold">{getOutcome()}</h3>
        <p>Come back tomorrow for the next quiz!</p>
      </div>}
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg w-full max-w-3xl p-4 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-500 dark:text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</div>
          <div className="text-gray-500 dark:text-gray-400">{userQuiz ? `Score: ${userQuiz.score}` : ''}</div>
        </div>
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">{quiz.questions[currentQuestion].question}</h2>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${userQuiz ? 'pointer-events-none' : ''}`}>
          {quiz.questions[currentQuestion].options.map((answer, idx) => getOptionButton(answer, idx))}
        </div>
        <div className="flex justify-between mt-6 font-light text-sm">
          <button
              onClick={() => {setCurrentQuestion(Math.max(0, currentQuestion - 1))}}
              disabled={currentQuestion === 0}
              className={getNavigationButtonClassName(currentQuestion === 0)}>
            Previous
          </button>
          <button
              onClick={() => {setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}}
              disabled={currentQuestion === quiz.questions.length - 1}
              className={getNavigationButtonClassName(currentQuestion === quiz.questions.length - 1)}>
            Next
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row mt-6 gap-y-4 w-full max-w-3xl">
        {!submitted &&
        <div className="flex-1 lg:flex-none order-first lg:order-last">
          <form action={() => submitQuiz(quiz, answers, user?.score || 0)}>
            <SubmitButton {...props} user={user} answers={answers} />
          </form>
        </div>
        }
        {user?.id && (
          <div className="dark:text-gray-100 px-8 lg:flex-1">
            <div className="w-36 flex flex-row">
              <span className="flex-1">Total score</span>
              <span>{user.score}</span>
            </div>
            <div className="w-36 flex flex-row">
              <span className="flex-1">Games played</span>
              <span>{user.gamesPlayed}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

const SubmitButton = (props: any) => {
  const getSubmitButtonClassName = (disabled: boolean) => {
    const others = " rounded-lg py-3 px-6 transition-colors w-72"
    if (!disabled) {
      return "bg-gray-200 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" + others
    } else {
      return "bg-gray-300 dark:bg-gray-900 dark:text-gray-400" + others
    }
  }
  const user = props.user as User | undefined
  const answers = props.answers as number[]

  let text = ''
  if (!user) {
    text = 'Sign in to submit the quiz'
  } else if (answers.includes(-1)) {
    text = 'Complete the quiz to submit'
  } else {
    text = 'Submit your answers'
  }

  return (
    <button
      disabled={!user || answers.includes(-1)}
      className={getSubmitButtonClassName(!user || answers.includes(-1))}>
      {text}
    </button>
  )
}
