import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'

const planned = [
  { icon: '🌅', en: 'Morning workout reminder', lt: 'Rytinis treniruotės priminimas' },
  { icon: '💧', en: 'Hydration reminders every 3 hours', lt: 'Hidratacijos priminimai kas 3 val.' },
  { icon: '🛌', en: 'Rest day recovery tip', lt: 'Poilsio dienos patarimas' },
  { icon: '📊', en: 'Weekly progress summary', lt: 'Savaitinė pažangos suvestinė' },
]

export default function Notifications() {
  const { t, i18n } = useTranslation()
  const isLT = i18n.language === 'lt'

  return (
    <div className="space-y-5">
      <SectionHeader icon="🔔" title={t('notifications.title')} />

      <Card>
        <div className="space-y-3">
          {planned.map((n) => (
            <div key={n.en} className="flex items-center gap-3">
              <span className="text-xl">{n.icon}</span>
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {isLT ? n.lt : n.en}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        🔔 {t('notifications.comingSoon')}
      </div>
    </div>
  )
}
