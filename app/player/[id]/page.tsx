import { PlayerProfile } from '@/components/player-profile'
import { createClient } from '@/utils/supabase/server'

type Props = {
  params: { id: string }
}

export default async function PlayerPage({ params }: Props) {
  const { id } = params
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: userProfile, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    return <p>Error loading player.</p>
  }

  const { data: matchesData, error: matchesError } = await supabase
    .from('match')
    .select('*')
    .or(
      `player1_id.eq.${id},player2_id.eq.${id},partner1_id.eq.${id},partner2_id.eq.${id}`
    )

  if (matchesError) {
    console.error(matchesError)
    return <p>Error loading player matches.</p>
  }

  const matches = await Promise.all(
    matchesData.map(async (match) => {
      const playerIds = [match.player1_id, match.player2_id]

      if (match.is_doubles) {
        playerIds.push(match.partner1_id, match.partner2_id)
      }

      const { data: players, error } = await supabase
        .from('user')
        .select('id, name, lastname')
        .in('id', playerIds)

      if (error) {
        console.error(error)
        return <p>Error loading match data.</p>
      }

      const getPlayerFullName = (id: number) => {
        const player = players.find((p) => p.id === id)
        if (match.is_doubles) {
          return `${player?.lastname}`
        }
        return `${player?.name} ${player?.lastname}`
      }

      const opponent = match.is_doubles
        ? `${getPlayerFullName(match.player2_id)}/${getPlayerFullName(match.partner2_id)}`
        : getPlayerFullName(match.player2_id)

      const userTeam = match.is_doubles
        ? `${getPlayerFullName(match.player1_id)}/${getPlayerFullName(match.partner1_id)}`
        : getPlayerFullName(match.player1_id)

      const isUserTeam =
        userProfile.id === match.player1_id ||
        userProfile.id === match.partner1_id
      const result = match.winner_id === match.player1_id ? 'win' : 'loss'
      const setsLength = match.player1_score.length

      let score = ''

      for (let i = 0; i < setsLength; i++) {
        score += `${match.player1_score[i]}-${match.player2_score[i]}`
        if (i < setsLength - 1) {
          score += ', '
        }
      }

      return {
        opponent: isUserTeam ? opponent : userTeam,
        partner: isUserTeam ? userTeam : opponent,
        result: isUserTeam ? result : result === 'win' ? 'loss' : 'win',
        score,
        date: match.date_played,
        isDoubles: match.is_doubles,
      }
    })
  )

  const player = {
    ...userProfile,
    id: userProfile?.id.toString(),
    matches,
  }

  return <PlayerProfile currentUserId={user?.id ?? '0'} player={player} />
}
