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

import { Quiz, QuizSubmission, User } from '../core/db'
import { useState, useEffect, useRef } from "react"
import { submitQuiz, submitSignIn } from "../app/actions"
import { useFormStatus } from "react-dom"
import { ResultsDialog } from './results-dialog'

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
      return `bg-blue-300 dark:bg-blue-700 ${others}`
    case OptionButtonState.Correct:
      return `bg-green-500 dark:bg-green-700 ${others}`
    case OptionButtonState.Incorrect:
      return `bg-orange-400 dark:bg-orange-800 ${others}`
    default:
      return `bg-gray-200 dark:bg-gray-700 lg:hover:bg-gray-300 dark:lg:hover:bg-gray-600 ${others}`
  }
}

const getNavigationButtonClassName = (disabled: boolean) => {
  const others = " bg-gray-200 dark:bg-gray-700 rounded-lg py-3 px-6 transition-colors w-28"
  if (!disabled) {
    return "text-black font-bold dark:text-gray-200 lg:hover:bg-gray-300 dark:lg:hover:bg-gray-600" + others
  } else {
    return "text-gray-600 dark:text-gray-400" + others
  }
}

export function QuestionsView(props: any) {
  const quiz = props.quiz as Quiz
  const submitForm = useRef(null)
  const loading = props.loading as boolean
  const storageKey = `answers-${quiz.date}`
  const userQuiz = props.userQuiz as QuizSubmission | null
  const setUserQuiz = props.setUserQuiz as any
  const user = props.user as User | undefined
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const answers = props.answers as number[]
  const setAnswers = props.setAnswers as any
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem(storageKey) || 'null') as number[] | null
    if (user && !userQuiz && storedAnswers) {
      if (answers.join() !== storedAnswers.join()) {
        setAnswers(storedAnswers)
      } else {
        localStorage.removeItem(storageKey)
        setSubmitting(true)
        ;(submitForm.current as any)?.requestSubmit()
      }
    }
  }, [answers, storageKey, user, userQuiz, setAnswers])

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

  return (
    <>
      {!loading && <main className={`flex-1 lg:bg-gray-100 dark:bg-gray-800 p-4 lg:p-8 flex flex-col items-center ${submitting ? 'pointer-events-none blur-sm' : ''}`}>
        <div className="lg:bg-white lg:dark:bg-gray-900 lg:shadow-lg lg:rounded-lg w-full max-w-3xl p-4 py-2 lg:p-8 flex-1">
          <div className="grid grid-cols-3 justify-items-center mb-2 lg:mb-6 text-sm lg:text-base">
            <div className="text-gray-500 dark:text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</div>
            <div className="text-gray-500 dark:text-gray-400">{quiz.date}</div>
            <div className="text-gray-500 dark:text-gray-400">{userQuiz ? `Score: ${userQuiz.score}` : ''}</div>
          </div>
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">{quiz.questions[currentQuestion].question}</h2>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${userQuiz ? 'pointer-events-none' : ''}`}>
            {quiz.questions[currentQuestion].options.map((answer, idx) => getOptionButton(answer, idx))}
          </div>
        </div>
        <div className="flex flex-col mt-6 place-content-end gap-4 min-w-96 px-8">
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
          {!userQuiz &&
          <div className="place-self-center min-w-full">
            {!!user &&
            <form ref={submitForm} action={async () => {
              setSubmitting(true)
              const _userQuiz = await submitQuiz(quiz, answers)
              setSubmitting(false)
              if (_userQuiz) {
                setUserQuiz(_userQuiz)
              }
            }}>
              <SubmitButton {...props} {...{ user, answers, setSubmitting }} />
            </form>}
            {!user &&
            <form ref={submitForm} action={async () => {
              localStorage.setItem(storageKey, JSON.stringify(answers))
              await submitSignIn()
            }}>
              <SignInToSubmitButton {...props} {...{ answers }} />
            </form>}
          </div>
          }
        </div>
      </main>}
      <ResultsDialog {...props} />
    </>
  )
}

const getSubmitButtonClassName = (disabled: boolean) => {
  let others = " rounded-lg py-3 px-6 transition-colors min-w-full"
  if (!disabled) {
    return "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 lg:hover:bg-gray-300 dark:lg:hover:bg-gray-600" + others
  } else {
    return "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400" + others
  }
}

const SubmitButton = (props: any) => {
  const answers = props.answers as number[]
  const setSubmitting = props.setSubmitting as any

  let text = ''
  if (answers.includes(-1)) {
    text = 'Complete the quiz to submit'
  } else {
    text = 'Submit your answers'
  }

  const { pending } = useFormStatus()
  const disabled = pending || answers.includes(-1)

  return (
    <button
      disabled={disabled}
      onClick={() => setSubmitting(true)}
      className={getSubmitButtonClassName(disabled)}>
      {text}
    </button>
  )
}

const SignInToSubmitButton = (props: any) => {
  const answers = props.answers as number[]

  let text = ''
  if (answers.includes(-1)) {
    text = 'Complete the quiz to submit'
  } else {
    text = 'Sign in and submit the quiz'
  }

  const { pending } = useFormStatus()
  const disabled = pending || answers.includes(-1)

  return (
    <button
      disabled={disabled}
      className={getSubmitButtonClassName(disabled)}>
      {text}
    </button>
  )
}
