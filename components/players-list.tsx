'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Player = {
  category: string | null

  city: string | null

  created_at: string

  email: string | null

  id: string | null

  lastname: string | null

  name: string | null

  neighborhood: string | null

  rating: number | null

  tel: number | null
}

type PlayersListProps = {
  players: Player[]
}

export function PlayersList({ players }: PlayersListProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Lista de Jugadores de Tenis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  {player.name} {player.lastname}
                </TableCell>
                <TableCell>{player.category}</TableCell>
                <TableCell>{player.rating}</TableCell>
                <TableCell>
                  {player.neighborhood}, {player.city}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
