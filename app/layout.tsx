import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <title>Tennis Tracker</title>
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex flex-col max-w-5xl p-5">{children}</div>

            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
