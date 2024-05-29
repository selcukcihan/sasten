import { auth } from "@/auth"
import { QuizView } from "../components/quiz-view"
import { getTodaysQuiz, getUsersQuiz, getQuiz, getUser, getTopScores, getAllScores } from "../core/db"

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
  const quiz = await getTodaysQuiz()
  const topScores = await getTopScores()
  if (session && session.user?.id && quiz) {
    const userQuiz = await getUsersQuiz(session.user.id, quiz.date)
    const user = await getUser(session.user.id)
    const allScores = await getAllScores()
    return <QuizView topScores={topScores} session={session} quiz={quiz} user={user} userQuiz={userQuiz} allScores={allScores} />
  } else {
    return <QuizView topScores={topScores} session={session} quiz={quiz} />
  }
}
