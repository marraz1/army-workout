import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  icon: string
  key: string
  end?: boolean
}

const items: NavItem[] = [
  { to: '/', icon: '🏠', key: 'home', end: true },
  { to: '/schedule', icon: '📅', key: 'schedule' },
  { to: '/guide', icon: '🖼️', key: 'guide' },
  { to: '/progress', icon: '📊', key: 'progress' },
  { to: '/profile', icon: '👤', key: 'profile' },
]

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="safe-bottom sticky bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors',
                isActive
                  ? 'text-navy dark:text-flag-yellow'
                  : 'text-slate-400 dark:text-slate-500',
              )
            }
          >
            <span className="text-xl">{item.icon}</span>
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
