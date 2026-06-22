import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
