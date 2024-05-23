import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const title = "Dev Quiz"
const description = "Test your programming knowledge with daily quizzes."

export const metadata: Metadata = {
  title,
  description,
  applicationName: title,
  keywords: ['quiz', 'programming', 'dev', 'developer', 'coding', 'code', 'software', 'engineer', 'web', 'app', 'application', 'site', 'website', 'daily', 'challenge', 'test', 'knowledge', 'skills', 'learning', 'education', 'fun', 'game', 'puzzle', 'problem', 'solution', 'answer', 'question', 'multiple', 'choice', 'true', 'false', 'boolean', 'score', 'leaderboard', 'top', 'best', 'rank'],
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    siteId: '134182720',
    creator: '@scihan',
    creatorId: '134182720',
    images: [`https://quiz.selcukcihan.com/icon.png`],
  },
  openGraph: {
    siteName: title,
    title,
    type: 'website',
    url: 'https://quiz.selcukcihan.com',
    description,
    images: [{
      url: `https://quiz.selcukcihan.com/icon.png`,
      width: 1000,
      height: 1304,
      alt: title,
    }],
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
