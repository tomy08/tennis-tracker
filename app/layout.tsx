import DeployButton from '@/components/deploy-button'
import { EnvVarWarning } from '@/components/env-var-warning'
import HeaderAuth from '@/components/header-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { hasEnvVars } from '@/utils/supabase/check-env-vars'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import Link from 'next/link'
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
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex flex-col max-w-5xl p-5">{children}</div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <div>
                Tennis Tracker was a project made by{' '}
                <a
                  href="https://github.com/tomy08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Tomas Santa Cruz
                </a>
              </div>
              <ThemeSwitcher />
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
