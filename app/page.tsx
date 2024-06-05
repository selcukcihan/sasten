import { auth } from "@/auth"
import { getUser, getTopScores, getAllScores, getUserQuizzes, getTodaysQuiz, getUsersQuiz } from "../core/db"
import QuizView from "../components/quiz-view"
import { Leaderboard } from "../components/leaderboard"
import Link from "next/link"
import { getToday } from "../core/date"

export default async function Home(props: any) {
  const session = await auth()

  if (!!session?.user?.id) {
    const [user, allScores, topScores, userQuizzes, quiz, userQuiz] = await Promise.all([
      getUser(session.user.id),
      getAllScores(),
      getTopScores(),
      getUserQuizzes(session.user.id),
      getTodaysQuiz(),
      getUsersQuiz(session.user.id, getToday()),
    ])
    let previousQuizzes = userQuizzes.filter(q => q.date !== quiz.date)
    return <MainView {...props} {...{ session, user, topScores, allScores, userQuizzes: previousQuizzes, quiz, userQuiz }} />
  } else {
    const [topScores, quiz] = await Promise.all([getTopScores(), getTodaysQuiz()])
    return <MainView {...props} {...{ session, topScores, quiz }} />
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
    </div>
  )
}
