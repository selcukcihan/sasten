import { auth } from "@/auth"
import { getQuiz, getUser, getTopScores, getAllScores, getUserQuizzes } from "../core/db"
import QuizView from "../components/quiz-view"
import { Leaderboard } from "../components/leaderboard"
import Link from "next/link"
import { ResultsDialog } from "../components/results-dialog"

export default async function Home(props: any) {
  const session = await auth()

  if (!!session?.user?.id) {
    const [user, allScores, topScores, userQuizzes] = await Promise.all([
      getUser(session.user.id),
      getAllScores(),
      getTopScores(),
      getUserQuizzes(session.user.id),
    ])
    return <MainView {...props} {...{ session, user, topScores, allScores, userQuizzes }} />
  } else {
    const topScores = await getTopScores()
    return <MainView {...props} {...{ session, topScores }} />
  }
}

function MainView(props: any) {
  return (
    <div className="lg:flex lg:flex-col lg:h-screen">
      <div className="flex flex-col min-h-svh lg:min-h-fit lg:h-full">
        <QuizView {...props} />
      </div>
      <footer className="bg-gray-900 text-white py-4 px-6">
        <Leaderboard {...props} showUserStats={true} />
        <div className="text-xs text-gray-300 underline underline-offset-2 text-center lg:text-right">
          <Link href={'https://github.com/selcukcihan/sasten'} target="#blank">Check out the project on GitHub</Link>
        </div>
      </footer>
      <ResultsDialog {...props} />
    </div>
  )
}
