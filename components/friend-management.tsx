'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/client'
import {
  sendFriendRequest,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/app/actions'
import type { Friends, Player } from '@/types/player'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { UserCheck, UserX } from 'lucide-react'

export function FriendManagement() {
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Player[]>([])
  const [sentRequests, setSentRequests] = useState<Friends[]>([])
  const [receivedRequests, setReceivedRequests] = useState<Friends[]>([])
  const [friends, setFriends] = useState<Friends[]>([])

  const fetchFriends = async () => {
    const friendsData = await getFriends()
    if (friendsData) {
      setFriends(friendsData.filter((f: Friends) => f.status === 'accepted'))
      setSentRequests(
        friendsData.filter(
          (f: Friends) => f.status === 'pending' && f.user_id === user?.id
        )
      )
      setReceivedRequests(
        friendsData.filter(
          (f: Friends) => f.status === 'pending' && f.friend_id === user?.id
        )
      )
    }
  }
  useEffect(() => {
    const fetchPlayers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data: players, error } = await supabase.from('user').select('*')

      if (!user) {
        redirect('/login')
      }

      setUser(user)
      setPlayers(players || [])
    }
    fetchFriends()
    fetchPlayers()
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults([])
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()

      const results =
        players?.filter((player) => {
          const matchesName = player.name
            ?.toLowerCase()
            .includes(lowerCaseSearchTerm)
          const matchesLastName = player.lastname
            ?.toLowerCase()
            .includes(lowerCaseSearchTerm)
          const isNotCurrentUser = player.id !== user?.id
          const isNotFriend = !friends.some(
            (friend) =>
              friend.friend_id === player.id || friend.user_id === player.id
          )
          const isNotRequested = !sentRequests.some(
            (request) => request.friend_id === player.id
          )
          const isNotReceived = !receivedRequests.some(
            (request) => request.user_id === player.id
          )

          return (
            (matchesName || matchesLastName) &&
            isNotCurrentUser &&
            isNotFriend &&
            isNotRequested &&
            isNotReceived
          )
        }) || []

      setSearchResults(results)
    }
  }, [searchTerm, players, user, friends, sentRequests])

  const handleSendRequest = async (player: Player) => {
    if (player.email) {
      await sendFriendRequest(player.email)
      fetchFriends()
      setSearchResults(
        searchResults.filter((result) => result.id !== player.id)
      )
    }
  }

  const handleAcceptRequest = async (friendId: string | null) => {
    if (friendId) {
      await acceptFriendRequest(friendId)
      fetchFriends()
    }
  }

  const handleRejectRequest = async (friendId: string | null) => {
    if (friendId) {
      await rejectFriendRequest(friendId)
      fetchFriends()
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto sm:scale-100 scale-[0.65]">
      <CardHeader>
        <CardTitle>Manage Friends</CardTitle>
        <CardDescription>Find and manage your tennis friends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="flex w-full overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="search">Search Players</TabsTrigger>
            <TabsTrigger value="received">Requests to Accept</TabsTrigger>
            <TabsTrigger value="sent">Sent Requests</TabsTrigger>
            <TabsTrigger value="friends">Your Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search players by name or surname"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ScrollArea className="h-[300px] w-full pr-4">
                {searchResults.length > 0 ? (
                  <ul className="space-y-4">
                    {searchResults.map((player) => (
                      <li
                        key={player.id}
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {player.name?.[0]}
                              {player.lastname?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {player.name} {player.lastname}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Level: {player.category}
                            </p>
                          </div>
                        </div>
                        <form action={() => handleSendRequest(player)}>
                          <Button variant="outline" size="sm" type="submit">
                            Send Request
                          </Button>
                        </form>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground">
                    {searchTerm
                      ? 'No players found'
                      : 'Start typing to search for players'}
                  </p>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="received">
            <ScrollArea className="h-[300px] w-full pr-4">
              {receivedRequests.length > 0 ? (
                <ul className="space-y-4">
                  {receivedRequests.map((request) => (
                    <li
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {
                              players.find(
                                (player) => player.id === request.user_id
                              )?.name?.[0]
                            }
                            {
                              players.find(
                                (player) => player.id === request.user_id
                              )?.lastname?.[0]
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {
                              players.find(
                                (player) => player.id === request.user_id
                              )?.name
                            }{' '}
                            {
                              players.find(
                                (player) => player.id === request.user_id
                              )?.lastname
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pending Request
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAcceptRequest(request.user_id)}
                        >
                          <UserCheck className="h-4 w-4" />
                          <span className="sr-only">Accept</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRejectRequest(request.user_id)}
                        >
                          <UserX className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">
                  No pending friend requests to accept.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="sent">
            <ScrollArea className="h-[300px] w-full pr-4">
              {sentRequests.length > 0 ? (
                <ul className="space-y-4">
                  {sentRequests.map((request) => (
                    <li
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {
                              players.find(
                                (player) => player.id === request.friend_id
                              )?.name![0]
                            }
                            {
                              players.find(
                                (player) => player.id === request.friend_id
                              )?.lastname![0]
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {
                              players.find(
                                (player) => player.id === request.friend_id
                              )?.name
                            }{' '}
                            {
                              players.find(
                                (player) => player.id === request.friend_id
                              )?.lastname
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pending Request
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectRequest(request.friend_id)}
                      >
                        Cancel Request
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">
                  You haven't sent any friend requests.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="friends">
            <ScrollArea className="h-[300px] w-full pr-4">
              {friends.length > 0 ? (
                <ul className="space-y-4">
                  {friends.map((friend) => {
                    const player = players.find(
                      (player) =>
                        player.id === friend.friend_id ||
                        player.id === friend.user_id
                    )
                    return (
                      <li
                        key={friend.id}
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {player?.name?.[0] + '' + player?.lastname?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {player?.name} {player?.lastname}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Friend
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectRequest(friend.friend_id)}
                        >
                          Remove Friend
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">
                  You don't have any tennis friends yet.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
