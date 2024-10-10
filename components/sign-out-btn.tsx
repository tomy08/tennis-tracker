'use client'
import { createClient } from '@/utils/supabase/client'
import { Button } from './ui/button'

export function SignOutBtn() {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/sign-up'
  }

  return (
    <Button
      className="text-sm font-medium hover:text-primary transition-colors"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  )
}
