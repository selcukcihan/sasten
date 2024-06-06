import { auth } from "@/auth"
import { getAllAuthUsers, getAllUsers, getUser } from "../../core/db"
import AdminPanel from "../../components/admin-panel"
import { notFound } from "next/navigation"

export default async function Home(props: any) {
  const session = await auth()
  const user = session?.user?.id ? await getUser(session.user.id) : null
  if (user?.isAdmin) {
    const users = await getAllUsers()
    const authUsers = await getAllAuthUsers()
    return <AdminPanel {...{users, authUsers}} />
  } else {
    return notFound()
  }
}
