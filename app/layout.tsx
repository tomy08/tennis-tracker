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
  title: 'Tennis Tracker',
  description: 'Track your tennis matches and improve your game.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
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
