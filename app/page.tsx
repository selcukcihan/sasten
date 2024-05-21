import { auth } from "@/auth"
import { QuizView } from "../components/quiz-view"
import { getTodaysQuiz } from "../core/db"

export default async function Home() {
  const session = await auth()
  // get auth, get today’s questions, if authenticated, get user’s score + answers for today if already answered
  const quiz = await getTodaysQuiz()
  return <QuizView session={session} quiz={quiz} />
}
