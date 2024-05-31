import { LeaderBoardUser } from "../core/db"
import { UserStats } from "./user-stats"

const getLeaderBoardRowClassName = (idx: number) => {
  const others = "text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2 "
  switch (idx) {
    case 0:
      return others + " bg-yellow-500"
    case 1:
      return others + " bg-yellow-700"
    case 2:
      return others + " bg-yellow-900"
    default:
      return others + " bg-gray-500"
  }
}

function TopScores(props: any) {
  const topScores = (props.topScores || []) as LeaderBoardUser[]

  return (
    <div className="flex flex-col items-center gap-2">
      <div>
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <div className="flex flex-col">
        {topScores.map((user, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <div className={getLeaderBoardRowClassName(idx)}>
              {idx + 1}
            </div>
            <div>{user.name}: {user.score}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Leaderboard(props: any) {
  const topScores = (props.topScores || []) as LeaderBoardUser[]
  const showUserStats = !!props.showUserStats

  if (showUserStats) {
    return (
      <div className="flex flex-col gap-8">
        <UserStats {...props} />
        <TopScores {...props} />
      </div>
    )
  } else {
    return (
      <TopScores {...props} />
    )
  }
}
