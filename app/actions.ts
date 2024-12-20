'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  const supabase = createClient()
  const origin = headers().get('origin')

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect('error', '/sign-up', error.message)
  }

  return encodedRedirect(
    'success',
    '/sign-up',
    'Thanks for signing up! Please check your email for a verification link.'
  )
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message)
  }

  return redirect('/complete-profile')
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = createClient()
  const origin = headers().get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password'
    )
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.'
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password and confirm password are required'
    )
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      'error',
      '/protected/reset-password',
      'Passwords do not match'
    )
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password update failed'
    )
  }

  encodedRedirect('success', '/protected/reset-password', 'Password updated')
}

export const signOutAction = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/sign-in'
}

export const getProfile = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error(error)
  }
  return data
}

export const updateUserProfile = async (formData: FormData) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userId = user?.id
  const name = formData.get('name') as string
  const lastname = formData.get('lastname') as string
  const country = formData.get('country') as string
  const city = formData.get('city') as string
  const neighborhood = formData.get('neighborhood') as string
  const category = formData.get('category') as string
  const areacode = formData.get('area-code') as string
  const tel = formData.get('tel') as string

  let rating = 0
  switch (category) {
    case 'Beginner':
      rating = 80
      break
    case 'Intermediate':
      rating = 280
      break
    case 'Advanced':
      rating = 480
      break
    case 'Professional':
      rating = 700
      break
    default:
      rating = 0
  }

  const { data, error } = await supabase.from('user').insert([
    {
      id: userId,
      name,
      lastname,
      country,
      city,
      neighborhood,
      category,
      rating,
      tel,
      areacode,
    },
  ])

  if (error) {
    console.error('Error updating profile:', error)
    return { error }
  }

  redirect(`/player/${userId}`)
  return { data }
}

export const sendFriendRequest = async (friendEmail: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: friend, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', friendEmail)
    .single()

  if (friend) {
    const { error } = await supabase
      .from('friends')
      .insert({ user_id: user?.id, friend_id: friend.id, status: 'pending' })

    if (error) console.error(error)
  }
}

export const acceptFriendRequest = async (friendId: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('user_id', friendId)
    .eq('friend_id', user?.id)

  if (error) console.error(error)
}

export const rejectFriendRequest = async (friendId: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('friends')
    .delete()
    .or(`user_id.eq.${friendId}, friend_id.eq.${friendId}`)
    .or(`user_id.eq.${user?.id}, friend_id.eq.${friendId}`)

  if (error) console.error(error)
}

export const getFriends = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .or(`user_id.eq.${user?.id}, friend_id.eq.${user?.id}`)

  if (error) {
    console.error(error)
  }
  return data
}
