import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'LAF Fit — Karinis Treniruoklis',
  description:
    'Prepare for the Lithuanian Armed Forces fitness test. Ages 25–50.',
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
}

// The app is auth-gated and renders from client context/session — render
// dynamically rather than statically prerendering at build time.
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt" className="h-full">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
