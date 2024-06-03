import { auth } from "@/auth"
import { QuizView } from "../components/quiz-view"
import { getTodaysQuiz, getUsersQuiz, getQuiz, getUser, getTopScores, getAllScores, getUserQuizzes } from "../core/db"
import { notFound } from 'next/navigation'

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
  const quiz = searchParams?.["display"] && session?.user ? await getQuiz(searchParams["display"] as string) : await getTodaysQuiz()
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
    return <QuizView {...{ session, quiz, user, userQuiz, topScores, allScores, userQuizzes }} />
  } else {
    return <QuizView {...{ session, quiz, topScores }} />
  }
}
