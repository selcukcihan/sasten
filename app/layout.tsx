import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getDefaultQuiz } from "../core/db"

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

export const metadata: Metadata = {
  title: description,
  description: firstQuestion,
  applicationName: title,
  keywords: ['quiz', 'programming', 'dev', 'developer', 'coding', 'code', 'software', 'engineer', 'web', 'app', 'application', 'site', 'website', 'daily', 'challenge', 'test', 'knowledge', 'skills', 'learning', 'education', 'fun', 'game', 'puzzle', 'problem', 'solution', 'answer', 'question', 'multiple', 'choice', 'true', 'false', 'boolean', 'score', 'leaderboard', 'top', 'best', 'rank'],
  // twitter: {
  //   card: 'summary',
  //   title,
  //   description: firstQuestion,
  //   siteId: '134182720',
  //   creator: '@scihan',
  //   creatorId: '134182720',
  //   images,
  // },
  openGraph: {
    siteName: title,
    title: description,
    description: firstQuestion,
    type: 'website',
    url: 'https://quiz.selcukcihan.com',
    images,
  },
};

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
