import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useApp } from '@/context/AppContext'
import { cn, todayISO } from '@/lib/utils'
import type { SkipReason } from '@/types'

const reasons: { value: SkipReason; key: string; icon: string }[] = [
  { value: 'Sick', key: 'skip.sick', icon: '🤒' },
  { value: 'Tired', key: 'skip.tired', icon: '😴' },
  { value: 'Travel', key: 'skip.travel', icon: '✈️' },
  { value: 'Other', key: 'skip.other', icon: '❓' },
]

export default function SkipCheatDay() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { addLog } = useApp()

  const isCheat = params.get('cheat') === '1'
  const [reason, setReason] = useState<SkipReason>('Tired')

  const confirm = () => {
    addLog({
      date: todayISO(),
      status: isCheat ? 'cheat' : 'skipped',
      reason: isCheat ? undefined : reason,
      loggedAt: new Date().toISOString(),
    })
    navigate('/', { replace: true })
  }

  return (
    <div>
      <SectionHeader icon="🎭" title={t('skip.title')} />

      {isCheat ? (
        <Card>
          <div className="text-center">
            <div className="text-5xl">🎭</div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {t('skip.cheatNote')}
            </p>
            <Button onClick={confirm} className="mt-5 w-full">
              {t('skip.confirmCheat')}
            </Button>
          </div>
        </Card>
      ) : (
        <Card title={t('skip.chooseReason')}>
          <div className="grid grid-cols-2 gap-3">
            {reasons.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                  reason === r.value
                    ? 'bg-navy text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200',
                )}
              >
                <span className="text-lg">{r.icon}</span>
                {t(r.key)}
              </button>
            ))}
          </div>
          <Button onClick={confirm} className="mt-5 w-full">
            {t('skip.confirmSkip')}
          </Button>
        </Card>
      )}

      <Button variant="ghost" className="mt-3 w-full" onClick={() => navigate('/')}>
        {t('common.cancel')}
      </Button>
    </div>
  )
}
