'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, UserPlus, TrendingUp, Award } from 'lucide-react'

export function MainPage() {
  const handleSubmitLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const location = formData.get('location') as string
    window.location.href = `/find-players/${location}`
  }
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Tennis Tracker
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Track your matches, improve your game, and connect with other
                  tennis players.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-black/10 w-full">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <UserPlus className="h-10 w-10" />
                <h3 className="text-xl font-bold">Add Friends</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with other tennis players and grow your network.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <TrendingUp className="h-10 w-10" />
                <h3 className="text-xl font-bold">Track Matches</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Record your matches and keep track of your performance.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Award className="h-10 w-10" />
                <h3 className="text-xl font-bold">View Statistics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analyze your game with detailed statistics and insights.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find Players Near You
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover new opponents and friends in your area.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form
                  className="flex space-x-2"
                  onSubmit={handleSubmitLocation}
                >
                  <Input
                    className="max-w-lg flex-1"
                    name="location"
                    placeholder="Enter your location"
                    type="text"
                  />
                  <Button type="submit">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
