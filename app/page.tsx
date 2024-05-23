import { auth } from "@/auth"
import { QuizView } from "../components/quiz-view"
import { getTodaysQuiz, getUsersQuiz, getUser, getTopScores } from "../core/db"

export default async function Home() {
  const session = await auth()
  const quiz = await getTodaysQuiz()
  const topScores = await getTopScores()
  if (session && session.user?.id && quiz) {
    const userQuiz = await getUsersQuiz(session.user.id, quiz.date)
    const user = await getUser(session.user.id)
    return <QuizView topScores={topScores} session={session} quiz={quiz} user={user} userQuiz={userQuiz} />
  } else {
    return <QuizView topScores={topScores} session={session} quiz={quiz} />
  }
}
