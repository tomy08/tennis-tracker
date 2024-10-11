'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { Match, Player } from '@/types/player'
import { Database } from '@/types/supabase'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

type User = Database['public']['Tables']['user']['Row']

export function LoggedInDashboard({
  user,
  player,
}: {
  user: User
  player: Player
}): JSX.Element {
  const wins = player.matches!.filter((m) => m.result === 'win').length
  const losses = player.matches!.filter((m) => m.result === 'loss').length

  const winRate = (wins / (wins + losses)) * 100
  const maxWinningStreak = player.matches!.reduce(
    (acc, match) => {
      if (match.result === 'win') {
        acc.current += 1
        acc.max = Math.max(acc.current, acc.max)
      } else {
        acc.current = 0
      }
      return acc
    },
    { current: 0, max: 0 }
  ).max

  const maxLosingStreak = player.matches!.reduce(
    (acc, match) => {
      if (match.result === 'loss') {
        acc.current += 1
        acc.max = Math.max(acc.current, acc.max)
      } else {
        acc.current = 0
      }
      return acc
    },
    { current: 0, max: 0 }
  ).max

  const calculateWinRate = (matches: Match[]) => {
    const wins = matches.filter((m) => m.result === 'win').length
    return (wins / matches.length) * 100
  }

  const personalRecords = [
    { title: 'Total Matches', value: player.matches!.length },
    { title: 'Wins', value: wins },
    { title: 'Losses', value: losses },
    { title: 'Win Rate', value: `${winRate.toFixed(2)}%` },
    {
      title: 'Win Rate (last 30 matches)',
      value: `${calculateWinRate(player.matches!.slice(0, 30)).toFixed(2)}%`,
    },
    { title: 'Max Win Streak', value: maxWinningStreak },
    { title: 'Max Lose Streak', value: maxLosingStreak },
    { title: 'Points', value: player.rating },
  ]

  const last30MatchesPerformance = player
    .matches!.slice(0, 30)
    .map((match, index) => {
      const relevantMatches = player.matches!.slice(index, index + 10)
      return {
        match: index + 1,
        winRate: calculateWinRate(relevantMatches),
        date: new Date(match.date).toLocaleDateString(),
      }
    })

  const last30MatchesPerformanceSingles = player.matches
    ?.filter((match) => !match.isDoubles)
    .slice(0, 30)
    .map((match, index) => {
      const relevantMatches = player
        .matches!.filter((match) => !match.isDoubles)
        .slice(index, index + 10)
      return {
        match: index + 1,
        winRate: calculateWinRate(relevantMatches),
        date: new Date(match.date).toLocaleDateString(),
      }
    })

  const last30MatchesPerformanceDoubles = player.matches
    ?.filter((match) => match.isDoubles)
    .slice(0, 30)
    .map((match, index) => {
      const relevantMatches = player
        .matches!.filter((match) => match.isDoubles)
        .slice(index, index + 10)
      return {
        match: index + 1,
        winRate: calculateWinRate(relevantMatches),
        date: new Date(match.date).toLocaleDateString(),
      }
    })

  const winRateData = last30MatchesPerformance.map((match, index) => {
    const singlesMatch = last30MatchesPerformanceSingles![index]
    const doublesMatch = last30MatchesPerformanceDoubles![index]
    return {
      match: match.date,
      singles: singlesMatch?.winRate ?? 0,
      doubles: doublesMatch?.winRate ?? 0,
      overall: match.winRate,
    }
  })

  const calculateSetStats = () => {
    let setsWonSingles = 0
    let setsLostSingles = 0
    let setsWonDoubles = 0
    let setsLostDoubles = 0
    player.matches!.forEach((match) => {
      const sets = match.score.split(', ')
      sets.forEach((set) => {
        const [player1, player2] = set.split('-').map(Number)
        if (player1 > player2) {
          if (match.isDoubles) setsWonDoubles++
          else setsWonSingles++
        } else {
          if (match.isDoubles) setsLostDoubles++
          else setsLostSingles++
        }
      })
    })

    return {
      singles: [
        { name: 'Won', value: setsWonSingles },
        { name: 'Lost', value: setsLostSingles },
      ],
      doubles: [
        { name: 'Won', value: setsWonDoubles },
        { name: 'Lost', value: setsLostDoubles },
      ],
      overall: [
        { name: 'Won', value: setsWonSingles + setsWonDoubles },
        { name: 'Lost', value: setsLostSingles + setsLostDoubles },
      ],
    }
  }

  const setStats = calculateSetStats()
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6">
        {/* { <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentMatches.map((match, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{match.opponent}</span>
                  <span
                    className={
                      match.result === 'Won' ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {match.result} ({match.score})
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Winners This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topWinners.map((winner, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{winner.name}</span>
                  <span className="font-semibold">{winner.wins} wins</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Best Win Rates (Last 30 Matches)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {bestWinRates.map((player, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{player.name}</span>
                  <span className="font-semibold">{player.rate}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>} */}
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Win-Rate Last 30 Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={winRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="singles" stroke="#8884d8" />
                  <Line type="monotone" dataKey="doubles" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="overall" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sets Won/Lost (Singles)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={setStats.singles}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {setStats.singles.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sets Won/Lost (Doubles)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={setStats.doubles}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {setStats.doubles.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sets Won/Lost (Overall)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={setStats.overall}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {setStats.overall.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-bold mt-12 mb-6">Your Records</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {personalRecords.map((record, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm">{record.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{record.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
