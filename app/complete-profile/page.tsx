import { updateUserProfile } from '@/app/actions'
import { createClient } from '@/utils/supabase/server'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { FormMessage } from '@/components/form-message'
import { Select } from '@/components/ui/select'
import { redirect } from 'next/navigation'

export default async function CompleteProfile({
  searchParams,
}: {
  searchParams: any
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('No user is logged in')
    return
  }

  const userId = user.id

  const { data, error } = await supabase
    .from('user')
    .select('id')
    .eq('id', userId)
    .single()

  if (data) {
    redirect(`/player/${userId}`)
  }

  return (
    <form
      className="flex flex-col min-w-64 max-w-64 mx-auto gap-1"
      action={updateUserProfile}
    >
      <h1 className="text-2xl font-medium">Complete your profile</h1>

      <Label htmlFor="name">First Name</Label>
      <Input name="name" placeholder="First Name" required className="mb-2" />

      <Label htmlFor="lastname">Last Name</Label>
      <Input
        name="lastname"
        placeholder="Last Name"
        required
        className="mb-2"
      />

      <Label htmlFor="city">City</Label>
      <Input name="city" placeholder="City" required className="mb-2" />

      <Label htmlFor="neighborhood">Neighborhood</Label>
      <Input
        name="neighborhood"
        placeholder="Neighborhood"
        required
        className="mb-2"
      />

      <Label htmlFor="category">Category</Label>
      <Select
        name="category"
        options={[
          'Amateur',
          'Beginner',
          'Intermediate',
          'Advanced',
          'Professional',
        ]}
        required
        className="mb-2"
      />

      <SubmitButton pendingText="Updating...">Update Profile</SubmitButton>

      <FormMessage message={searchParams} />
    </form>
  )
}
