import { LeaderBoardUser, User } from "../core/db"

export function UserStats(props: any) {
  const allScores = props.allScores as LeaderBoardUser[]
  const user = props.user as User | undefined
  const getUsersRanking = () => {
    if (!user) return 0
    return allScores.sort((a, b) => b.score - a.score).findIndex(u => u.userId === user.id) + 1
  }

  if (!user) {
    return null
  }

  return (
    <div className="dark:text-gray-100 flex flex-col items-center">
      <div className="w-36 flex flex-row">
        <span className="flex-1">Total score</span>
        <span>{user.score}</span>
      </div>
      <div className="w-36 flex flex-row">
        <span className="flex-1">Games</span>
        <span>{user.gamesPlayed}</span>
      </div>
      <div className="w-36 flex flex-row">
        <span className="flex-1">Ranking</span>
        <span>{getUsersRanking()}/{allScores.length}</span>
      </div>
    </div>
  )
}
