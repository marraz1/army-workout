'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: string
  key: string
}

const items: NavItem[] = [
  { href: '/', icon: '🏠', key: 'home' },
  { href: '/schedule', icon: '📅', key: 'schedule' },
  { href: '/guide', icon: '🖼️', key: 'guide' },
  { href: '/history', icon: '📈', key: 'history' },
  { href: '/profile', icon: '👤', key: 'profile' },
]

export function BottomNav() {
  const { t } = useTranslation()
  const pathname = usePathname() ?? '/'

  return (
    <nav className="safe-bottom sticky bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        {items.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors',
                active
                  ? 'text-navy dark:text-flag-yellow'
                  : 'text-slate-400 dark:text-slate-500',
              )}
            >
              <span className="text-xl">{item.icon}</span>
              {t(`nav.${item.key}`)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
