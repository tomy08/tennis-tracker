'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Player } from '@/types/player'
import { createClient } from '@/utils/supabase/client'
import { validateSet, getWinner } from '@/lib/utils'
import { FormMessage, Message } from '@/components/form-message'

type SetScore = {
  player1: number
  player2: number
}

export function MatchRegistration({
  user,
  friends,
}: {
  user: Player
  friends: Player[]
}): JSX.Element {
  const [message, setMessage] = useState<Message>({ message: '' })
  const [isDoubles, setIsDoubles] = useState(false)
  const [numberOfSets, setNumberOfSets] = useState<'3' | '5'>('3')
  const [setScores, setSetScores] = useState<SetScore[]>([
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 },
  ])
  const supabase = createClient()

  const handleSetScoreChange = (
    setIndex: number,
    player: 'player1' | 'player2',
    value: number
  ) => {
    const newSetScores = [...setScores]
    newSetScores[setIndex][player] = value
    setSetScores(newSetScores)
  }

  const handleNumberOfSetsChange = (value: '3' | '5') => {
    setNumberOfSets(value)
    if (value === '5' && setScores.length === 3) {
      setSetScores([
        ...setScores,
        { player1: 0, player2: 0 },
        { player1: 0, player2: 0 },
      ])
    } else if (value === '3' && setScores.length === 5) {
      setSetScores(setScores.slice(0, 3))
    }
  }

  let hasErrors = false
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    for (let i = 0; i < setScores.length; i++) {
      if (setScores[i].player1 === 0 && setScores[i].player2 === 0) {
        setSetScores((e) => {
          const newSetScores = [...setScores]
          newSetScores.splice(i, 1)
          return newSetScores
        })
      }
    }

    const player1SetsWon = setScores.filter(
      (set) => set.player1 > set.player2
    ).length

    const player2SetsWon = setScores.filter(
      (set) => set.player2 > set.player1
    ).length

    const matchData = {
      player1_id: formData.get('player1'),
      player2_id: formData.get('player2'),
      is_doubles: isDoubles,
      partner1_id: isDoubles ? formData.get('partner1') : null,
      partner2_id: isDoubles ? formData.get('partner2') : null,
      date_played: formData.get('datePlayed') ?? new Date().toISOString(),
      player1_score: [...setScores].map((set) => set.player1),
      player2_score: [...setScores].map((set) => set.player2),
      created_at: new Date().toISOString(),
      winner_id:
        player1SetsWon > player2SetsWon
          ? formData.get('player1')
          : formData.get('player2'),
    }

    if (!hasErrors) {
      try {
        const { data, error } = await supabase
          .from('match')
          .insert([matchData])
          .select()

        if (error) throw error

        const message = {
          success: 'Match registered successfully',
        }
        setMessage(message)
        hasErrors = false
      } catch (error) {
        console.error('Error registering match:', error)
        const message = {
          error: 'Error registering match',
        }
        setMessage(message)
        hasErrors = true
      }
    }
  }

  useEffect(() => {
    if (hasErrors) {
    }
  }, [message])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register Tennis Match</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="doubles"
            checked={isDoubles}
            onCheckedChange={setIsDoubles}
          />
          <Label htmlFor="doubles">Doubles Match</Label>
        </div>

        <div>
          <Label htmlFor="numberOfSets">Number of Sets</Label>
          <Select value={numberOfSets} onValueChange={handleNumberOfSetsChange}>
            <SelectTrigger id="numberOfSets">
              <SelectValue placeholder="Select number of sets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Best of 3</SelectItem>
              <SelectItem value="5">Best of 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="player1">Player 1</Label>
            <Select name="player1" defaultValue={user.id ?? ''}>
              <SelectTrigger id="player1">
                <SelectValue placeholder="Select player 1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={user.id ?? ''}>
                  {user.name} {user.lastname}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="player2">Player 2</Label>
            <Select name="player2">
              <SelectTrigger id="player2">
                <SelectValue placeholder="Select player 2" />
              </SelectTrigger>
              <SelectContent>
                {friends.map((friend) => (
                  <SelectItem key={friend.id} value={friend.id ?? ''}>
                    {friend.name} {friend.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isDoubles && (
            <>
              <div>
                <Label htmlFor="partner1">Partner 1</Label>
                <Select name="partner1">
                  <SelectTrigger id="partner1">
                    <SelectValue placeholder="Select partner 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {friends.map((friend) => (
                      <SelectItem key={friend.id} value={friend.id ?? ''}>
                        {friend.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="partner2">Partner 2</Label>
                <Select name="partner2">
                  <SelectTrigger id="partner2">
                    <SelectValue placeholder="Select partner 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {friends.map((friend) => (
                      <SelectItem key={friend.id} value={friend.id ?? ''}>
                        {friend.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div>
          <Label>Set Scores</Label>
          {setScores.map((setScore, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <Input
                type="number"
                value={setScore.player1}
                onChange={(e) =>
                  handleSetScoreChange(
                    index,
                    'player1',
                    parseInt(e.target.value)
                  )
                }
                placeholder={`Set ${index + 1} Player 1`}
              />
              <Input
                type="number"
                value={setScore.player2}
                onChange={(e) =>
                  handleSetScoreChange(
                    index,
                    'player2',
                    parseInt(e.target.value)
                  )
                }
                placeholder={`Set ${index + 1} Player 2`}
              />
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="datePlayed">Date Played</Label>
          <Input type="date" id="datePlayed" name="datePlayed" />
        </div>

        <Button type="submit">Register Match</Button>
      </form>
      <hr className="my-4" />
      <FormMessage message={message} />
    </div>
  )
}
