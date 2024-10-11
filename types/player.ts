export type Player = {
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
  matches: Match[] | null
}
export type Friends = {
  id: string | null
  user_id: string | null
  friend_id: string | null
  status: string | null
}

export interface Match {
  opponent: string
  partner: string | null
  result: 'win' | 'loss'
  score: string
  date: string
  isDoubles: boolean
}
