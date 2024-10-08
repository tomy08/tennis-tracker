'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { sendFriendRequest, getFriends } from '@/app/actions'
interface Match {
  opponent: string
  partner: string | null
  result: 'win' | 'loss'
  score: string
  date: string
  isDoubles: boolean
}

interface Player {
  id: string | null
  name: string | null
  lastname: string | null
  email: string | null
  tel: number | null
  category: string | null
  city: string | null
  neighborhood: string | null
  rating: number | null
  created_at: string
  matches: Match[]
}

export function PlayerProfile({
  currentUserId,
  player,
}: {
  currentUserId: string
  player: Player
}) {
  const [isFriend, setIsFriend] = useState(false)
  const [isLogged, setIsLogged] = useState(true)
  const [headToHeadSearch, setHeadToHeadSearch] = useState('')
  const [headToHeadResults, setHeadToHeadResults] = useState<Match[]>([])

  const handleAddFriend = () => {
    sendFriendRequest(player.email || '')
    alert('Friend request sent')
  }

  useEffect(() => {
    if (currentUserId == '0') {
      setIsLogged(false)
    } else {
      setIsLogged(true)
    }
    const fetchFriends = async () => {
      const friends = await getFriends()
      setIsFriend(
        friends?.some(
          (friend: any) =>
            friend.id === player.id && friend.status == 'accepted'
        ) ?? false
      )
    }
    fetchFriends()
  }, [currentUserId, player.id])

  const handleHeadToHeadSearch = () => {
    const results = player.matches.filter((match) =>
      match.opponent.toLowerCase().includes(headToHeadSearch.toLowerCase())
    )
    setHeadToHeadResults(results)
  }

  const wins = player.matches.filter((m) => m.result === 'win').length
  const losses = player.matches.filter((m) => m.result === 'loss').length

  const winRate = (wins / (wins + losses)) * 100
  const maxWinningStreak = player.matches.reduce(
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

  const calculateWinRate = (matches: Match[]) => {
    const wins = matches.filter((m) => m.result === 'win').length
    return (wins / matches.length) * 100
  }

  const last30MatchesPerformance = player.matches
    .slice(0, 30)
    .map((match, index) => {
      const relevantMatches = player.matches.slice(index, index + 10)
      return {
        match: index + 1,
        winRate: calculateWinRate(relevantMatches),
        date: new Date(match.date).toLocaleDateString(),
      }
    })

  const calculateSetStats = () => {
    let setsWon = 0
    let setsLost = 0
    player.matches.forEach((match) => {
      const sets = match.score.split(', ')
      sets.forEach((set) => {
        const [playerScore, opponentScore] = set.split('-').map(Number)
        if (playerScore > opponentScore) setsWon++
        else setsLost++
      })
    })
    return [
      { name: 'Sets Won', value: setsWon },
      { name: 'Sets Lost', value: setsLost },
    ]
  }

  const setStats = calculateSetStats()
  const COLORS = ['#0088FE', '#FF8042']

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={`/placeholder.svg?height=96&width=96`}
              alt={`${player.name} ${player.lastname}`}
            />
            <AvatarFallback>
              {player.name?.[0]}
              {player.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-3xl">
              {player.name} {player.lastname}
            </CardTitle>
            <p className="text-muted-foreground">{player.email}</p>
            <Badge variant="secondary" className="w-fit mt-2">
              Rating: {player.rating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="headtohead">Head to Head</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="font-semibold">Category:</span>{' '}
                  {player.category}
                </div>
                <div>
                  <span className="font-semibold">City:</span> {player.city}
                </div>
                <div>
                  <span className="font-semibold">Neighborhood:</span>{' '}
                  {player.neighborhood}
                </div>
                <div>
                  <span className="font-semibold">Member Since:</span>{' '}
                  {new Date(player.created_at).toLocaleDateString()}
                </div>
                {(isFriend || currentUserId === player.id) && (
                  <div>
                    <span className="font-semibold">Phone:</span> {player.tel}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="stats">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <span className="font-semibold">Wins</span>
                  <span className="text-2xl">{wins}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Losses</span>
                  <span className="text-2xl">{losses}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Win Rate</span>
                  <span className="text-2xl">{winRate.toFixed(2)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Max Winning Streak</span>
                  <span className="text-2xl">{maxWinningStreak}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="matches">
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Singles Matches</h3>
                <div className="space-y-2">
                  {player.matches
                    .filter((match) => !match.isDoubles)
                    .map((match, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div className="flex-1">
                          <span className="font-semibold">
                            {match.opponent}
                          </span>
                        </div>
                        <div className="flex-1 text-center">
                          <span
                            className={
                              match.result === 'win'
                                ? 'text-green-500 font-bold'
                                : 'text-red-500'
                            }
                          >
                            {match.result.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          {match.score.split(', ').map((set, idx) => (
                            <span
                              key={idx}
                              className={
                                parseInt(set.split('-')[0]) >
                                parseInt(set.split('-')[1])
                                  ? 'text-green-500 mr-2'
                                  : 'text-red-500 mr-2'
                              }
                            >
                              {set}
                            </span>
                          ))}
                        </div>
                        <div className="flex-1 text-right">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  Doubles Matches
                </h3>
                <div className="space-y-2">
                  {player.matches
                    .filter((match) => match.isDoubles)
                    .map((match, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div className="flex-1">
                          <span className="font-semibold text-sm">
                            ({match.partner})
                            <br />
                            {match.opponent}
                          </span>
                        </div>
                        <div className="flex-1 text-center">
                          <span
                            className={
                              match.result === 'win'
                                ? 'text-green-500 font-bold'
                                : 'text-red-500'
                            }
                          >
                            {match.result.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          {match.score.split(', ').map((set, idx) => (
                            <span
                              key={idx}
                              className={
                                parseInt(set.split('-')[0]) >
                                parseInt(set.split('-')[1])
                                  ? 'text-green-500 mr-2'
                                  : 'text-red-500 mr-2'
                              }
                            >
                              {set}
                            </span>
                          ))}
                        </div>
                        <div className="flex-1 text-right">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="performance">
              <div className="mt-4 space-y-8">
                <div className="h-80">
                  <h3 className="text-lg font-semibold mb-2">
                    Win Rate (Last 30 Matches)
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last30MatchesPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="match"
                        label={{
                          value: 'Last 30 Matches',
                          position: 'insideBottom',
                          offset: -5,
                        }}
                      />
                      <YAxis
                        label={{
                          value: 'Win Rate (%)',
                          angle: -90,
                          position: 'insideLeft',
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-black p-2 border rounded shadow">
                                <p className="font-bold">{`Match ${payload[0].payload.match}`}</p>
                                <p>{`Win Rate: ${Number(payload[0]?.value).toFixed(2) ?? 'N/A'}%`}</p>
                                <p>{`Date: ${payload[0].payload.date}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="winRate"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <h3 className="text-lg font-semibold mb-2">
                    Sets Won vs Sets Lost
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={setStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {setStats.map((entry, index) => (
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
                </div>
              </div>
            </TabsContent>
            <TabsContent value="headtohead">
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search opponent..."
                    value={headToHeadSearch}
                    onChange={(e) => setHeadToHeadSearch(e.target.value)}
                  />
                  <Button onClick={handleHeadToHeadSearch}>Search</Button>
                </div>
                <div className="space-y-2">
                  {headToHeadResults.map((match, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div className="flex-1">
                        <span className="font-semibold">{match.opponent}</span>
                      </div>
                      <div className="flex-1 text-center">
                        <span
                          className={
                            match.result === 'win'
                              ? 'text-green-500 font-bold'
                              : 'text-red-500'
                          }
                        >
                          {match.result.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        {match.score.split(', ').map((set, idx) => (
                          <span
                            key={idx}
                            className={
                              parseInt(set.split('-')[0]) >
                              parseInt(set.split('-')[1])
                                ? 'text-green-500 mr-2'
                                : 'text-red-500 mr-2'
                            }
                          >
                            {set}
                          </span>
                        ))}
                      </div>
                      <div className="flex-1 text-right">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
