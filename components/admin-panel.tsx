/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UErfZxlH1r9
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useMemo } from "react"
import { QuizDetails, User } from "../core/db"
import Link from "next/link"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "./ui/tabs"
import { CardContent, CardHeader, CardTitle, Card } from "./ui/card"

export default function AdminPanel(props: any) {
  const users = props.users as User[]
  const authUsers = props.authUsers as string[]
  const quizzes = props.quizDetails as QuizDetails[]
  const [activeTab, setActiveTab] = useState("users")
  const diff = authUsers.filter(id => !users.find(user => user.id === id))

  const [sortColumn, setSortColumn] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }
  const sortedUsers = useMemo(() => {
    return [...users as any[]].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [users, sortColumn, sortDirection])
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/">Developer Quiz Admin</Link>
          </h1>
          <Link href="/">Home</Link>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-slate-200 p-8">
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
          <Tabs defaultValue="users" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 gap-2 mb-6">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="quizzes">Quiz Details</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <h2 className="text-2xl font-bold mb-6">User Management</h2>
              <p>{`There are ${diff.length} users who never played a game.`}</p>
              <p>{`There are a total of ${users.length} users that have played at least one game.`}</p>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("id")}>
                        User ID{" "}
                        {sortColumn === "id" && (
                          <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                        )}
                      </th>
                      <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("name")}>
                        Name{" "}
                        {sortColumn === "name" && (
                          <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                        )}
                      </th>
                      <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("email")}>
                        Email{" "}
                        {sortColumn === "email" && (
                          <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                        )}
                      </th>
                      <th className="px-4 py-2 text-right cursor-pointer" onClick={() => handleSort("score")}>
                        Total Score{" "}
                        {sortColumn === "score" && (
                          <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                        )}
                      </th>
                      <th className="px-4 py-2 text-right cursor-pointer" onClick={() => handleSort("gamesPlayed")}>
                        Games Played{" "}
                        {sortColumn === "gamesPlayed" && (
                          <span className="ml-2">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3">{user.id}</td>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3 text-right">{user.score}</td>
                        <td className="px-4 py-3 text-right">{user.gamesPlayed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="quizzes">
              <h2 className="text-2xl font-bold mb-6">Quiz Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, quizIndex) => (
                  <Card key={quizIndex}>
                    <CardHeader>
                      <CardTitle>{quiz.date}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div>Completed Users:</div>
                        <div className="font-bold">{quiz.completedUsers}</div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>Average Score:</div>
                        <div className="font-bold">{(quiz.averageScore * 100 / quiz.questions.length).toPrecision(4)}%</div>
                      </div>
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-bold mb-2">Questions</h3>
                        {quiz.questions.map((question, questionIndex) => (
                          <div key={questionIndex} className="mb-4">
                            <div className="font-medium">{question.text}</div>
                            <div className="flex justify-between items-center">
                              <div>Correct Answers:</div>
                              <div className="font-bold">{question.correctAnswers}</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>Incorrect Answers:</div>
                              <div className="font-bold">{question.incorrectAnswers}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex justify-center items-center">
          <p>© 2024 Developer Quiz Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
