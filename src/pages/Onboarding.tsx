import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import { useApp } from '@/context/AppContext'
import { ageGroupForAge } from '@/data/ageGroups'
import { cn, pickLang, todayISO } from '@/lib/utils'
import type { FitnessLevel, Gender, Lang } from '@/types'

const TOTAL_STEPS = 6

export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setProfile, language, setLanguage } = useApp()

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<Gender>('M')
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('Intermediate')
  const [wakeTime, setWakeTime] = useState('06:00')

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const finish = () => {
    setProfile({
      name: name.trim() || 'Recruit',
      age,
      gender,
      fitnessLevel,
      language,
      wakeTime,
      createdAt: todayISO(),
    })
    navigate('/', { replace: true })
  }

  const group = ageGroupForAge(age)

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-br from-navy to-forest text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <div className="mb-6">
          <div className="text-2xl font-extrabold">🇱🇹 {t('app.name')}</div>
          <div className="text-sm opacity-80">{t('onboarding.intro')}</div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                i < step ? 'bg-flag-yellow' : 'bg-white/25',
              )}
            />
          ))}
        </div>

        <div className="flex-1">
          {step === 1 && (
            <Field label={t('onboarding.name')}>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.namePlaceholder')}
                className="w-full rounded-xl border-0 bg-white/95 px-4 py-3 text-base text-slate-900 outline-none"
              />
            </Field>
          )}

          {step === 2 && (
            <Field label={`${t('onboarding.age')}: ${age}`}>
              <input
                type="range"
                min={25}
                max={50}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-flag-yellow"
              />
              <div
                className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold"
                style={{ background: group.bg, color: group.color }}
              >
                {pickLang(language, group.label, group.labelLT)} · {group.range}
              </div>
            </Field>
          )}

          {step === 3 && (
            <Field label={t('onboarding.gender')}>
              <Choice
                options={[
                  { value: 'M', label: t('onboarding.male'), icon: '♂️' },
                  { value: 'F', label: t('onboarding.female'), icon: '♀️' },
                ]}
                value={gender}
                onChange={(v) => setGender(v as Gender)}
              />
            </Field>
          )}

          {step === 4 && (
            <Field label={t('onboarding.fitnessLevel')}>
              <Choice
                options={[
                  { value: 'Beginner', label: t('onboarding.beginner'), icon: '🌱' },
                  { value: 'Intermediate', label: t('onboarding.intermediate'), icon: '⚡' },
                  { value: 'Advanced', label: t('onboarding.advanced'), icon: '🔥' },
                ]}
                value={fitnessLevel}
                onChange={(v) => setFitnessLevel(v as FitnessLevel)}
              />
            </Field>
          )}

          {step === 5 && (
            <Field label={t('onboarding.language')}>
              <Choice
                options={[
                  { value: 'EN', label: 'English', icon: '🇬🇧' },
                  { value: 'LT', label: 'Lietuvių', icon: '🇱🇹' },
                ]}
                value={language}
                onChange={(v) => setLanguage(v as Lang)}
              />
            </Field>
          )}

          {step === 6 && (
            <Field label={t('onboarding.wakeTime')}>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-xl border-0 bg-white/95 px-4 py-3 text-base text-slate-900 outline-none"
              />
            </Field>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={back}
            disabled={step === 1}
            className="text-sm font-semibold text-white/70 disabled:opacity-0"
          >
            ← {t('common.back')}
          </button>
          <div className="text-xs text-white/60">
            {t('onboarding.stepOf', { current: step, total: TOTAL_STEPS })}
          </div>
          {step < TOTAL_STEPS ? (
            <Button onClick={next} className="bg-flag-yellow text-navy hover:bg-yellow-400">
              {t('common.next')} →
            </Button>
          ) : (
            <Button onClick={finish} className="bg-flag-yellow text-navy hover:bg-yellow-400">
              {t('onboarding.startPlan')} 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-lg font-bold">{label}</div>
      {children}
    </div>
  )
}

interface ChoiceProps {
  options: { value: string; label: string; icon: string }[]
  value: string
  onChange: (value: string) => void
}

function Choice({ options, value, onChange }: ChoiceProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-semibold transition-colors',
            value === opt.value
              ? 'bg-flag-yellow text-navy'
              : 'bg-white/15 text-white hover:bg-white/25',
          )}
        >
          <span className="text-xl">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
