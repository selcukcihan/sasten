import { auth } from "@/auth"
import { QuizView } from "../components/quiz-view"
import { getTodaysQuiz, getUsersQuiz, getQuiz, getUser, getTopScores, getAllScores, getUserQuizzes, Quiz } from "../core/db"
import { notFound } from 'next/navigation'
import { getToday } from "../core/date";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth()
  if (searchParams?.["date"] && session?.user?.email === 'selcukcihan@gmail.com') {
    const quiz = await getQuiz(searchParams["date"] as string)
    if (quiz) {
      return <QuizView session={session} quiz={quiz} />
    }
  }
  let quiz: Quiz | null = null
  let displayingTodaysQuiz = true
  const displayDate = searchParams?.["display"] as string | undefined
  if (displayDate && session?.user && displayDate < getToday()) {
    quiz = await getQuiz(displayDate)
    displayingTodaysQuiz = false
  } else {
    quiz = await getTodaysQuiz()
  }
  if (!quiz) {
    return notFound()
  }
  const topScores = await getTopScores()
  if (session && session.user?.id && quiz) {
    const [userQuiz, user, allScores, userQuizzes] = await Promise.all([
      getUsersQuiz(session.user.id, quiz.date),
      getUser(session.user.id),
      getAllScores(),
      getUserQuizzes(session.user.id),
    ])
    if (!displayingTodaysQuiz && !userQuizzes.find(q => q.date === quiz.date)) {
      return notFound()
    }
    return <QuizView {...{ session, quiz, user, userQuiz, topScores, allScores, userQuizzes }} />
  } else {
    return <QuizView {...{ session, quiz, topScores }} />
  }
}
