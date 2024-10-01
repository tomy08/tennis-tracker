'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

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
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(players)
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    city: '',
    neighborhood: '',
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  if (players.length === 0) {
    return <p>No players found.</p>
  }

  const applyFilters = () => {
    setFilteredPlayers(
      players.filter(
        (player) =>
          (player.name!.toLowerCase().includes(filters.name.toLowerCase()) ||
            player
              .lastname!.toLowerCase()
              .includes(filters.name.toLowerCase())) &&
          player.city!.toLowerCase().includes(filters.city.toLowerCase()) &&
          player
            .neighborhood!.toLowerCase()
            .includes(filters.neighborhood.toLowerCase()) &&
          filters.category.toLocaleLowerCase() != 'category' &&
          player
            .category!.toLowerCase()
            .includes(filters.category.toLowerCase())
      )
    )
  }

  const clearFilters = () => {
    setFilteredPlayers(players)
    setFilters({
      name: '',
      category: '',
      city: '',
      neighborhood: '',
    })
    redirect('/find-players')
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Filter players by name, category, city or neighborhood
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Nombre"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <Select
            name="category"
            options={[
              'Category',
              'Amateur',
              'Beginner',
              'Intermediate',
              'Advanced',
              'Professional',
            ]}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
          />

          <Input
            placeholder="Ciudad"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Barrio"
            name="neighborhood"
            value={filters.neighborhood}
            onChange={handleFilterChange}
          />
        </div>
        <Button onClick={applyFilters} className="mb-2">
          Apply Filters
        </Button>
        <button onClick={clearFilters} className="underline block">
          Clear Filters
        </button>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Players List
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
              {filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`/player/${player.id}`}
                      className="hover:underline"
                    >
                      {player.name} {player.lastname}
                    </a>
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
    </>
  )
}
