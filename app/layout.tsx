import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getDefaultQuiz, getTodaysQuiz } from "../core/db"

const inter = Inter({ subsets: ["latin"] });

const title = "Dev Quiz"
const description = "Test your programming knowledge with daily quizzes."
const firstQuestion = getDefaultQuiz().questions[0].question

const images = [{
  url: `https://quiz.selcukcihan.com/icon.png`,
  width: 360,
  height: 360,
  alt: title,
}]

export async function generateMetadata() {
  const dynamicQuestion = await getTodaysQuiz()
  const shortestQuestion = dynamicQuestion.questions.reduce((prev, curr) => prev.question.length < curr.question.length ? prev : curr)
  return {
    title: description,
    description: shortestQuestion.question,
    applicationName: title,
    keywords: ['quiz', 'programming', 'dev', 'developer', 'coding', 'code', 'software', 'engineer', 'web', 'app', 'application', 'site', 'website', 'daily', 'challenge', 'test', 'knowledge', 'skills', 'learning', 'education', 'fun', 'game', 'puzzle', 'problem', 'solution', 'answer', 'question', 'multiple', 'choice', 'true', 'false', 'boolean', 'score', 'leaderboard', 'top', 'best', 'rank'],
    openGraph: {
      siteName: title,
      title: description,
      description: shortestQuestion.question,
      type: 'website',
      url: 'https://quiz.selcukcihan.com',
      images,
    },
  }
}

/*
export const metadata: Metadata = {
  title: description,
  description: firstQuestion,
  applicationName: title,
  keywords: ['quiz', 'programming', 'dev', 'developer', 'coding', 'code', 'software', 'engineer', 'web', 'app', 'application', 'site', 'website', 'daily', 'challenge', 'test', 'knowledge', 'skills', 'learning', 'education', 'fun', 'game', 'puzzle', 'problem', 'solution', 'answer', 'question', 'multiple', 'choice', 'true', 'false', 'boolean', 'score', 'leaderboard', 'top', 'best', 'rank'],
  openGraph: {
    siteName: title,
    title: description,
    description: firstQuestion,
    type: 'website',
    url: 'https://quiz.selcukcihan.com',
    images,
  },
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
