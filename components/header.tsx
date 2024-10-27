'use client'

import { TrendingUp, UserCircle, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { SignOutBtn } from './sign-out-btn'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header({ user }: { user: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const NavItems = () => (
    <>
      <Link
        className="text-sm font-medium hover:text-primary transition-colors"
        href="/ranking"
      >
        Ranking
      </Link>
      <Link
        className="text-sm font-medium hover:text-primary transition-colors"
        href="/find-players"
      >
        Find Players
      </Link>
      <Link
        className="text-sm font-medium hover:text-primary transition-colors"
        href="/stats"
      >
        Stats
      </Link>

      {user ? (
        <>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/create-match"
          >
            Add Match
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/friends"
          >
            Friends
          </Link>

          <Link
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
            href={`/player/${user.id}`}
          >
            <UserCircle className="h-4 w-4" />
            Profile
          </Link>
          <SignOutBtn />
        </>
      ) : (
        <>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/sign-in"
          >
            Sign In
          </Link>
          <Link
            className="text-sm font-medium hover:text-primary transition-colors"
            href="/sign-up"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-background border-b">
      <Link className="flex items-center justify-center" href="/">
        <TrendingUp className="h-6 w-6 text-primary" />
        <span className="sr-only">Tennis Tracker</span>
      </Link>
      <nav className="hidden md:flex items-center gap-4 sm:gap-6">
        <NavItems />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}