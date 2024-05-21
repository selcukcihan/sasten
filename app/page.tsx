import { auth } from "@/auth"
import { Quiz } from "../components/quiz"

export default async function Home() {
  const session = await auth()
  return <Quiz session={session} />
}
