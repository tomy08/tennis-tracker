'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

type Match = {
  id: string
  created_at: string
  player1_id: string
  player2_id: string
  is_doubles: boolean
  partner1_id: string | null
  partner2_id: string | null
  player1_score: number
  player2_score: number
  winner_id: string
  date_played: string
}

type User = {
  id: string
  name: string
  lastname: string
  rating: number
}

type Stats = {
  mostWins: { name: string; wins: number }[]
  longestStreak: { name: string; streak: number }[]
  highestWinRate: { name: string; rate: number }[]
  highestRating: { name: string; rating: number }[]
}

export function StatsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [timeFrame, setTimeFrame] = useState<
    'week' | 'month' | 'last30' | 'allTime'
  >('allTime')
  const [stats, setStats] = useState<Stats>({
    mostWins: [],
    longestStreak: [],
    highestWinRate: [],
    highestRating: [],
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [timeFrame])

  async function fetchData() {
    const { data: matchesData, error: matchesError } = await supabase
      .from('match')
      .select('*')
      .order('date_played', { ascending: false })

    if (matchesError) {
      console.error('Error fetching matches:', matchesError)
      return
    }

    const { data: usersData, error: usersError } = await supabase
      .from('user')
      .select('id, name, lastname, rating')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }

    setMatches(matchesData)
    setUsers(usersData)

    calculateStats(matchesData, usersData)
  }

  function calculateStats(matches: Match[], users: User[]) {
    const now = new Date()
    const filteredMatches = matches.filter((match) => {
      if (timeFrame === 'allTime') return true
      const matchDate = new Date(match.date_played)
      if (timeFrame === 'week') {
        return now.getTime() - matchDate.getTime() <= 7 * 24 * 60 * 60 * 1000
      } else if (timeFrame === 'month') {
        return now.getTime() - matchDate.getTime() <= 30 * 24 * 60 * 60 * 1000
      } else if (timeFrame === 'last30') {
        return matches.indexOf(match) < 30
      }
      return true
    })

    const winCounts: { [key: string]: number } = {}
    const streaks: { [key: string]: number } = {}
    const currentStreaks: { [key: string]: number } = {}
    const matchCounts: { [key: string]: number } = {}

    filteredMatches.forEach((match) => {
      const winnerId = match.winner_id
      const loserId =
        match.player1_id === winnerId ? match.player2_id : match.player1_id

      winCounts[winnerId] = (winCounts[winnerId] || 0) + 1
      matchCounts[winnerId] = (matchCounts[winnerId] || 0) + 1
      matchCounts[loserId] = (matchCounts[loserId] || 0) + 1

      currentStreaks[winnerId] = (currentStreaks[winnerId] || 0) + 1
      currentStreaks[loserId] = 0

      streaks[winnerId] = Math.max(
        streaks[winnerId] || 0,
        currentStreaks[winnerId]
      )
    })

    const getUserName = (id: string) => {
      const user = users.find((u) => u.id === id)
      return user ? `${user.name} ${user.lastname}` : 'Unknown'
    }

    const mostWins = Object.entries(winCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id, wins]) => ({ name: getUserName(id), wins }))

    const longestStreak = Object.entries(streaks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id, streak]) => ({ name: getUserName(id), streak }))

    const highestWinRate = Object.entries(winCounts)
      .map(([id, wins]) => ({
        id,
        rate: Number(((wins / (matchCounts[id] || 1)) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2)
      .map(({ id, rate }) => ({ name: getUserName(id), rate }))

    const highestRating = users
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2)
      .map((user) => ({
        name: `${user.name} ${user.lastname}`,
        rating: user.rating,
      }))

    setStats({
      mostWins,
      longestStreak,
      highestWinRate,
      highestRating,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tennis Stats</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <div className="mb-4">
          <Select
            onValueChange={(value) =>
              setTimeFrame(value as 'week' | 'month' | 'last30' | 'allTime')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allTime">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="last30">Last 30 Games</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsContent
          value="overview"
          className="flex items-center gap-2 flex-wrap max-w-[800px]"
        >
          <Card className="w-[300px] h-[250px]">
            <CardHeader>
              <CardTitle>Most Wins</CardTitle>
              <CardDescription>
                Players with the highest number of wins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.mostWins.map((player, index) => (
                <div key={index}>
                  <p
                    className={`${index === 0 ? 'text-2xl' : 'text-xl text-gray-300'} font-bold `}
                  >
                    {player.name}
                  </p>
                  <p
                    className={`${index === 0 ? 'text-xl text-white' : 'text-lg text-gray-300'}`}
                  >
                    {player.wins} wins
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="w-[300px] h-[250px]">
            <CardHeader>
              <CardTitle>Longest Win Streak</CardTitle>
              <CardDescription>
                Players with the longest consecutive wins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.longestStreak.map((player, index) => (
                <div key={index}>
                  <p
                    className={`${index === 0 ? 'text-2xl' : 'text-xl text-gray-300'} font-bold `}
                  >
                    {player.name}
                  </p>
                  <p
                    className={`${index === 0 ? 'text-xl text-white' : 'text-lg text-gray-300'}`}
                  >
                    {player.streak} games
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="w-[300px] h-[250px]">
            <CardHeader>
              <CardTitle>Highest Win Rate</CardTitle>
              <CardDescription>
                Players with the highest win percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.highestWinRate.map((player, index) => (
                <div key={index}>
                  <p
                    className={`${index === 0 ? 'text-2xl' : 'text-xl text-gray-300'} font-bold `}
                  >
                    {player.name}
                  </p>
                  <p
                    className={`${index === 0 ? 'text-xl text-white' : 'text-lg text-gray-300'}`}
                  >
                    {player.rate}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="w-[300px] h-[250px]">
            <CardHeader>
              <CardTitle>Highest Rating</CardTitle>
              <CardDescription>Players with the highest rating</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.highestRating.map((player, index) => (
                <div key={index}>
                  <p
                    className={`${index === 0 ? 'text-2xl' : 'text-xl text-gray-300'} font-bold `}
                  >
                    {player.name}
                  </p>
                  <p
                    className={`${index === 0 ? 'text-xl text-white' : 'text-lg text-gray-300'}`}
                  >
                    {player.rating} points
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Wins Comparison</CardTitle>
              <CardDescription>
                Top 2 players with the most wins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  wins: {
                    label: 'Wins',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.mostWins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="wins" fill="var(--color-wins)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Longest Win Streak Comparison</CardTitle>
              <CardDescription>
                Top 2 players with the longest win streaks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  streak: {
                    label: 'Streak',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.longestStreak}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="streak" fill="var(--color-streak)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Highest Win Rate Comparison</CardTitle>
              <CardDescription>
                Top 2 players with the highest win rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  rate: {
                    label: 'Win Rate (%)',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.highestWinRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="rate" fill="var(--color-rate)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Highest Rating Comparison</CardTitle>
              <CardDescription>
                Top 2 players with the highest ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  rating: {
                    label: 'Rating',
                    color: 'hsl(var(--chart-4))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.highestRating}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="rating" fill="var(--color-rating)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
