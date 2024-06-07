import { auth } from "@/auth"
import { getAllAuthUsers, getAllUsers, getOverallPerformance, getUser } from "../../core/db"
import AdminPanel from "../../components/admin-panel"
import { notFound } from "next/navigation"

export default async function Home(props: any) {
  const session = await auth()
  const user = session?.user?.id ? await getUser(session.user.id) : null
  if (user?.isAdmin) {
    const users = await getAllUsers()
    const authUsers = await getAllAuthUsers()
    const quizDetails = await getOverallPerformance()
    return <AdminPanel {...{users, authUsers, quizDetails }} />
  } else {
    return notFound()
  }
}
