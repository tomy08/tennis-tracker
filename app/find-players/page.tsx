import { PlayersList } from '@/components/players-list'
import { createClient } from '@/utils/supabase/server'
import { Player } from '@/types/player'

export default async function FindPlayersPage() {
  const supabase = createClient()

  const { data: players, error } = await supabase.from('user').select('*')

  if (error) {
    console.error('Error fetching players:', error)
    return <p>Failed to load players.</p>
  }

  if (!players || players.length === 0) {
    return <p>No players found.</p>
  }

  return (
    <>
      <PlayersList players={players as Player[]} />
    </>
  )
}
