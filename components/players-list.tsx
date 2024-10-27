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
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import type { Player } from '@/types/player'

type PlayersListProps = {
  players: Player[]
}

export function PlayersList({ players }: PlayersListProps) {
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(players)
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    country: '',
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
          player
            .country!.toLowerCase()
            .includes(filters.country.toLowerCase()) &&
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
      country: '',
      category: '',
      city: '',
      neighborhood: '',
    })
    redirect('/find-players')
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">
          Find your next tennis partner or opponent!
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          <Input
            placeholder="Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <Select
            name="category"
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue>Category</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amateur">Amateur</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
          />

          <Input
            placeholder="City"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Neighborhood"
            name="neighborhood"
            value={filters.neighborhood}
            onChange={handleFilterChange}
          />
          <Button onClick={applyFilters} className="max-w-[150px]">
            Apply Filters
          </Button>
        </div>

        <button onClick={clearFilters} className="underline block">
          Clear Filters
        </button>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pt-4">
          <CardTitle className="text-2xl font-bold text-center text-yellow-300">
            Players
            <hr />
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
                    {player.neighborhood}, {player.city}, {player.country}
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
