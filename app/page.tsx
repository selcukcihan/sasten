import { auth } from "@/auth"
import { getTodaysQuiz, getUsersQuiz, getQuiz, getUser, getTopScores, getAllScores, getUserQuizzes, Quiz } from "../core/db"
import { getToday } from "../core/date";
import QuizView from "../components/quiz-view";
import { Leaderboard } from "../components/leaderboard";
import Link from "next/link";
import { ResultsDialog } from "../components/results-dialog";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth()

  // admin hack to view any quiz
  if (searchParams?.["date"] && session?.user?.email === 'selcukcihan@gmail.com') {
    const quiz = await getQuiz(searchParams["date"] as string)
    if (quiz) {
      return <MainView session={session} quiz={quiz} />
    }
  }

  const todaysQuiz: Quiz = await getTodaysQuiz()
  let quiz: Quiz

  // if authenticated user wishes to view old quizzes
  const displayDate = searchParams?.["display"] as string | undefined
  if (session?.user && displayDate && displayDate < getToday()) {
    quiz = await getQuiz(displayDate) || todaysQuiz
  } else {
    quiz = todaysQuiz
  }

  if (!!session?.user?.id) {
    const userQuizzes = await getUserQuizzes(session.user.id)
    if (quiz !== todaysQuiz && !userQuizzes.find(q => q.date === quiz.date)) {
      // if user is trying to view an old quiz that they haven't played, redirect them to today's quiz
      quiz = todaysQuiz
    }

    const [userQuiz, user, allScores, topScores] = await Promise.all([
      getUsersQuiz(session.user.id, quiz.date),
      getUser(session.user.id),
      getAllScores(),
      getTopScores(),
    ])
    return <MainView {...{ session, quiz, user, userQuiz, topScores, allScores, userQuizzes, displayingTodaysQuiz: quiz === todaysQuiz }} />
  } else {
    const topScores = await getTopScores()
    return <MainView {...{ session, quiz, topScores, displayingTodaysQuiz: quiz === todaysQuiz }} />
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
