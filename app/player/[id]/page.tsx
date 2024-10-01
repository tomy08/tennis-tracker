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

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    return <p>Error loading player.</p>
  }

  const player = {
    ...data,
    id: data?.id.toString(),
    matches: [
      {
        opponent: 'Novak Djokovic',
        result: 'win',
        score: '6-4, 6-3, 7-6',
        date: '2023-06-11',
      },
      {
        opponent: 'Roger Federer',
        result: 'loss',
        score: '6-7, 6-4, 6-7, 6-7',
        date: '2023-05-28',
      },
      {
        opponent: 'Daniil Medvedev',
        result: 'win',
        score: '6-3, 6-3',
        date: '2023-05-14',
      },
      {
        opponent: 'Alexander Zverev',
        result: 'win',
        score: '6-1, 6-4',
        date: '2023-05-01',
      },
      {
        opponent: 'Stefanos Tsitsipas',
        result: 'loss',
        score: '4-6, 2-6',
        date: '2023-04-16',
      },
      {
        opponent: 'Carlos Alcaraz',
        result: 'win',
        score: '6-4, 4-6, 7-6',
        date: '2023-04-02',
      },
      {
        opponent: 'Andrey Rublev',
        result: 'win',
        score: '6-3, 6-4',
        date: '2023-03-19',
      },
      {
        opponent: 'Casper Ruud',
        result: 'win',
        score: '6-4, 6-4',
        date: '2023-03-05',
      },
      {
        opponent: 'Felix Auger-Aliassime',
        result: 'loss',
        score: '3-6, 6-7',
        date: '2023-02-19',
      },
      {
        opponent: 'Hubert Hurkacz',
        result: 'win',
        score: '7-6, 6-3',
        date: '2023-02-05',
      },
      {
        opponent: 'Matteo Berrettini',
        result: 'win',
        score: '6-4, 6-2',
        date: '2023-01-22',
      },
      {
        opponent: 'Diego Schwartzman',
        result: 'win',
        score: '6-3, 6-4',
        date: '2023-01-08',
      },
      {
        opponent: 'Rafael Nadal',
        result: 'loss',
        score: '4-6, 6-7',
        date: '2022-12-25',
      },
      {
        opponent: 'Dominic Thiem',
        result: 'win',
        score: '6-4, 6-3',
        date: '2022-12-11',
      },
      {
        opponent: 'Gael Monfils',
        result: 'win',
        score: '6-2, 6-3',
        date: '2022-11-27',
      },
      {
        opponent: 'David Goffin',
        result: 'win',
        score: '6-3, 6-4',
        date: '2022-11-13',
      },
      {
        opponent: 'Stan Wawrinka',
        result: 'loss',
        score: '6-7, 6-7',
        date: '2022-10-30',
      },
      {
        opponent: 'Kei Nishikori',
        result: 'win',
        score: '6-4, 6-3',
        date: '2022-10-16',
      },
      {
        opponent: 'Grigor Dimitrov',
        result: 'win',
        score: '6-3, 6-4',
        date: '2022-10-02',
      },
      {
        opponent: 'Karen Khachanov',
        result: 'win',
        score: '6-4, 6-3',
        date: '2022-09-18',
      },
      {
        opponent: 'Borna Coric',
        result: 'win',
        score: '6-3, 6-4',
        date: '2022-09-04',
      },
      {
        opponent: 'Milos Raonic',
        result: 'win',
        score: '6-4, 6-3',
        date: '2022-08-21',
      },
      {
        opponent: 'John Isner',
        result: 'win',
        score: '6-3, 6-4',
        date: '2022-08-07',
      },
      {
        opponent: 'Nick Kyrgios',
        result: 'win',
        score: '6-4, 6-3',
        date: '2022-07-24',
      },
    ],
  }

  return <PlayerProfile currentUserId={user?.id ?? '0'} player={player} />
}
