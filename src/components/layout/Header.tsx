import { useTranslation } from 'react-i18next'
import { useApp } from '@/context/AppContext'

export function Header() {
  const { t } = useTranslation()
  const { theme, toggleTheme, language, setLanguage } = useApp()

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-navy to-forest text-white shadow-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div>
          <div className="text-lg font-bold">🇱🇹 {t('app.name')}</div>
          <div className="text-[11px] opacity-80">{t('app.tagline')}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-white/15 text-base"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setLanguage(language === 'EN' ? 'LT' : 'EN')}
            className="h-9 rounded-lg border border-white/30 bg-white/15 px-3 text-sm font-bold"
          >
            {language === 'EN' ? '🇱🇹 LT' : '🇬🇧 EN'}
          </button>
        </div>
      </div>
    </header>
  )
}
