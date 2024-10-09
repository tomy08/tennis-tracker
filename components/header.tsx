import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <TrendingUp className="h-6 w-6" />
        <span className="sr-only">Tennis Tracker</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/"
        >
          Tennis Tracker
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/add-match"
        >
          Add Match
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/sign-up"
        >
          Sign Up
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/sign-in"
        >
          Sign In
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/find-players"
        >
          Find Players
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/friends"
        >
          Friends
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/ranking"
        >
          Ranking
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/records"
        >
          Records
        </Link>
      </nav>
    </header>
  )
}
