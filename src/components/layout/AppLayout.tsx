'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { useApp } from '@/context/AppContext'

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy to-forest text-white">
      <div className="text-center">
        <div className="text-3xl font-extrabold">🇱🇹 LAF Fit</div>
        <div className="mt-2 text-sm opacity-80">Loading…</div>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { profile, dataLoading } = useApp()

  // Once data has loaded, users without a profile must onboard first.
  useEffect(() => {
    if (!dataLoading && !profile) {
      router.replace('/onboarding')
    }
  }, [dataLoading, profile, router])

  if (dataLoading || !profile) return <Splash />

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  )
}
