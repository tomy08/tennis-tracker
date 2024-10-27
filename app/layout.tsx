import { GeistSans } from 'geist/font/sans'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

import './globals.css'
import { createClient } from '@/utils/supabase/server'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Tennis Tracker',
  description: 'Track your tennis matches and improve your game.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <html
      lang="en"
      className={GeistSans.className + ' dark'}
      suppressHydrationWarning
    >
      <body className="">
        <Header user={user} />
        <main className="min-h-screen flex flex-col items-center bg-none">
          <div className="flex flex-col max-w-5xl p-5 bg-none">{children}</div>

          <Footer />
        </main>
      </body>
    </html>
  )
}
