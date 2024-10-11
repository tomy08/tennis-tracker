import { PlayersList } from '@/components/players-list'
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/supabase'

type User = Database['public']['Tables']['user']['Row']
type Props = {
  params: { location: string }
}

export default async function FindPlayersLocationPage({ params }: Props) {
  const { location } = params

  const locationFiltered = location.toLowerCase().split('%20').join(' ')
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
      <PlayersList
        players={
          players?.filter((player) => {
            return (
              player.city!.toLowerCase().includes(locationFiltered) ||
              player.neighborhood!.toLowerCase().includes(locationFiltered)
            )
          }) as User[]
        }
      />
    </>
  )
}
