'use client'

import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function Settings() {
  const { t } = useTranslation()
  const { theme, toggleTheme, language, setLanguage } = useApp()

  return (
    <div className="space-y-5">
      <SectionHeader icon="⚙️" title={t('settings.title')} />

      <Card title={t('settings.theme')}>
        <div className="flex gap-3">
          {(['light', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                if (theme !== mode) toggleTheme()
              }}
              className={cn(
                'flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors',
                theme === mode
                  ? 'bg-navy text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200',
              )}
            >
              {mode === 'light' ? '☀️' : '🌙'} {t(`settings.${mode}`)}
            </button>
          ))}
        </div>
      </Card>

      <Card title={t('settings.language')}>
        <div className="flex gap-3">
          {(['EN', 'LT'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                'flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors',
                language === lang
                  ? 'bg-navy text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200',
              )}
            >
              {lang === 'EN' ? '🇬🇧 English' : '🇱🇹 Lietuvių'}
            </button>
          ))}
        </div>
      </Card>

      <Card title={t('settings.features')}>
        <div className="space-y-3">
          {(
            [
              { icon: '✏️', key: 'plan' },
              { icon: '📝', key: 'logger' },
              { icon: '📈', key: 'progress' },
            ] as const
          ).map((f) => (
            <div key={f.key} className="flex gap-3">
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {t(`settings.feature.${f.key}.title`)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t(`settings.feature.${f.key}.desc`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
