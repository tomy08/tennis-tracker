import { MatchRegistration } from '@/components/match-registration'
import { createClient } from '@/utils/supabase/server'
import { getFriends, getProfile } from '../actions'

export default async function AddMatch() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return (
      <a href="/sign-up" className="underline">
        You need to be logged in to add a match.
      </a>
    )
  }
  const profile = await getProfile(user.id)

  const friends = await getFriends()

  if (!friends) {
    return <p>You need to have friends to add a match.</p>
  }

  const acceptedFriends = friends.filter(
    (friend) => friend.status === 'accepted'
  )

  const friendIds1 = acceptedFriends.map((friend) => friend.friend_id)
  const friendIds2 = acceptedFriends.map((friend) => friend.user_id)

  const friendIds = friendIds1.concat(friendIds2)

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .in('id', friendIds)
    .neq('id', user.id)

  return <MatchRegistration user={profile} friends={data!} />
}
