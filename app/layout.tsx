import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

// Optimize font loading with Next.js Font Optimization
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgriMitra',
  description: 'Made with ❤️',
}

/**
 * Root Layout Component
 * This component wraps every page in the application.
 * It handles global styles, fonts, meta tags, and context providers.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
