import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgriMitra',
  description: 'Made with ❤️ by Akshay',
}

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
