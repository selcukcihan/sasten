import { auth } from "@/auth"
import { QuizView } from "../components/quiz-view"
import { getTodaysQuiz, getUsersQuiz, getQuiz, getUser, getTopScores, getAllScores, getUserQuizzes, Quiz } from "../core/db"
import { getToday } from "../core/date";

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
      return <QuizView session={session} quiz={quiz} />
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
    return <QuizView {...{ session, quiz, user, userQuiz, topScores, allScores, userQuizzes, displayingTodaysQuiz: quiz === todaysQuiz }} />
  } else {
    const topScores = await getTopScores()
    return <QuizView {...{ session, quiz, topScores, displayingTodaysQuiz: quiz === todaysQuiz }} />
  }
}
