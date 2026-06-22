'use client'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useApp } from '@/context/AppContext'
import { ageGroupForAge } from '@/data/ageGroups'
import { pickLang } from '@/lib/utils'

export default function Profile() {
  const { t } = useTranslation()
  const router = useRouter()
  const { profile, language } = useApp()
  const { data: session } = useSession()
  const user = session?.user

  if (!profile) return null
  const group = ageGroupForAge(profile.age)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.replace('/login')
  }

  const rows: { label: string; value: string }[] = [
    { label: t('onboarding.name'), value: profile.name },
    { label: t('onboarding.age'), value: String(profile.age) },
    {
      label: t('onboarding.gender'),
      value: profile.gender === 'M' ? t('onboarding.male') : t('onboarding.female'),
    },
    { label: t('onboarding.fitnessLevel'), value: profile.fitnessLevel },
    { label: t('profile.ageGroup'), value: pickLang(language, group.label, group.labelLT) },
    { label: t('profile.frequency'), value: group.frequency },
    { label: t('onboarding.wakeTime'), value: profile.wakeTime },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader icon="👤" title={t('profile.title')} />

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy to-forest text-2xl text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {profile.name}
            </div>
            <div className="text-sm" style={{ color: group.color }}>
              {pickLang(language, group.label, group.labelLT)} · {group.range}
            </div>
            {user?.email && (
              <div className="text-xs text-slate-400">{user.email}</div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between py-2.5 text-sm">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                {row.label}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => router.push('/settings')}>
          ⚙️ {t('settings.title')}
        </Button>
        <Button variant="secondary" onClick={() => router.push('/notifications')}>
          🔔 {t('notifications.title')}
        </Button>
      </div>

      <Button variant="danger" className="w-full" onClick={handleSignOut}>
        {t('auth.signOut')}
      </Button>
    </div>
  )
}
