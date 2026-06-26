'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { HoldToggle } from '@/components/calisthenics/HoldToggle'
import { RestPicker } from '@/components/calisthenics/RestPicker'
import { LevelBadge } from '@/components/calisthenics/LevelBadge'
import { useCalisthenics } from '@/context/CalisthenicsContext'
import type { CalisthenicsLevel, IllustrationTemplate } from '@/types/calisthenics'

const ALL_MUSCLES = [
  'Chest', 'Lats', 'Upper Back', 'Shoulders', 'Triceps', 'Biceps',
  'Core', 'Obliques', 'Hip Flexors', 'Lower Back',
  'Quads', 'Glutes', 'Hamstrings', 'Calves', 'Grip', 'Wrists', 'Full Body',
]

const LEVELS: CalisthenicsLevel[] = ['Beginner', 'Intermediate', 'Advanced']
const ILLUS: { key: IllustrationTemplate; icon: string; label: string }[] = [
  { key: 'push',  icon: '💪', label: 'Push'  },
  { key: 'pull',  icon: '🏋️', label: 'Pull'  },
  { key: 'squat', icon: '🦵', label: 'Squat' },
  { key: 'hold',  icon: '🤸', label: 'Hold'  },
]

interface Props {
  editId?: string
}

export default function CustomExerciseBuilder({ editId: editIdProp }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathParams = useParams()
  // Resolve the exercise ID from: explicit prop → path param (e.g. /exercise/[id]/edit) → query param
  const pathId = typeof pathParams.id === 'string' ? pathParams.id : undefined
  const editId = editIdProp ?? pathId ?? searchParams.get('id') ?? undefined
  const { customExercises, saveCustomExercise, updateCustomExercise, loading } = useCalisthenics()

  const existing = editId ? customExercises.find((e) => e.id === editId) : undefined

  const [name, setName] = useState('')
  const [muscles, setMuscles] = useState<string[]>([])
  const [level, setLevel] = useState<CalisthenicsLevel>('Beginner')
  const [sets, setSets] = useState(3)
  const [repsOrSecs, setRepsOrSecs] = useState(10)
  const [isTimed, setIsTimed] = useState(false)
  const [rest, setRest] = useState(60)
  const [description, setDescription] = useState('')
  const [illustrationTemplate, setIllustrationTemplate] = useState<IllustrationTemplate>('push')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [synced, setSynced] = useState(false)

  // Sync form fields once the exercise data loads (fixes stale-init on cold navigation)
  useEffect(() => {
    if (existing && !synced) {
      setName(existing.name)
      setMuscles(existing.muscles)
      setLevel(existing.level)
      setSets(existing.defaultSets)
      setRepsOrSecs(existing.defaultRepsOrSecs)
      setIsTimed(existing.isTimed)
      setRest(existing.restSec)
      setDescription(existing.description ?? '')
      setIllustrationTemplate(existing.illustrationTemplate ?? 'push')
      setNotes(existing.notes ?? '')
      setSynced(true)
    }
  }, [existing, synced])

  const toggleMuscle = (m: string) => {
    if (muscles.includes(m)) {
      setMuscles(muscles.filter((x) => x !== m))
    } else if (muscles.length < 4) {
      setMuscles([...muscles, m])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Name is required.'); return }
    if (name.length > 50) { setError('Name must be 50 characters or fewer.'); return }
    if (muscles.length === 0) { setError('Select at least one muscle group.'); return }

    setSaving(true)
    try {
      if (existing && editId) {
        await updateCustomExercise(editId, {
          name: name.trim(), muscles, level, defaultSets: sets,
          defaultRepsOrSecs: repsOrSecs, isTimed, restSec: rest,
          description: description || undefined, notes: notes || undefined,
          illustrationTemplate,
        })
      } else {
        await saveCustomExercise({
          name: name.trim(), muscles, level, defaultSets: sets,
          defaultRepsOrSecs: repsOrSecs, isTimed, restSec: rest,
          description: description || undefined, notes: notes || undefined,
          illustrationTemplate,
        })
      }
      router.push('/calisthenics')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save exercise.')
    } finally {
      setSaving(false)
    }
  }

  // Show spinner while loading exercise data in edit mode
  if (editId && loading && !existing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      <div className="sticky top-0 z-10 bg-white shadow-sm dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-500 dark:text-slate-400">←</button>
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {existing ? t('calisthenics.builderEditTitle') : t('calisthenics.builderTitle')}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Name */}
        <Field label={`${t('calisthenics.name')} (${name.length}/50)`}>
          <input
            type="text"
            value={name}
            maxLength={50}
            placeholder={t('calisthenics.namePlaceholder')}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          />
        </Field>

        {/* Muscle groups */}
        <Field label={`${t('calisthenics.muscleGroups')} (${muscles.length}/4)`}>
          <div className="flex flex-wrap gap-2">
            {ALL_MUSCLES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMuscle(m)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  muscles.includes(m)
                    ? 'bg-purple-600 text-white'
                    : muscles.length >= 4
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        {/* Difficulty */}
        <Field label={t('calisthenics.difficulty')}>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
                  level === l
                    ? 'ring-2 ring-purple-500'
                    : 'opacity-50'
                }`}
              >
                <LevelBadge level={l} />
              </button>
            ))}
          </div>
        </Field>

        {/* Sets */}
        <Field label={t('calisthenics.defaultSets')}>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSets((s) => Math.max(1, s - 1))} className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700">−</button>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 min-w-[2ch] text-center">{sets}</span>
            <button type="button" onClick={() => setSets((s) => Math.min(10, s + 1))} className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700">+</button>
          </div>
        </Field>

        {/* Reps / Hold */}
        <Field label={t('calisthenics.defaultRepsOrSecs')}>
          <div className="space-y-3">
            <HoldToggle isTimed={isTimed} onChange={setIsTimed} />
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setRepsOrSecs((r) => Math.max(1, r - 1))} className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700">−</button>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 min-w-[3ch] text-center">{repsOrSecs}</span>
              <button type="button" onClick={() => setRepsOrSecs((r) => r + 1)} className="h-10 w-10 rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700">+</button>
              <span className="text-slate-500">{isTimed ? t('calisthenics.secondsLabel') : t('calisthenics.repsLabel')}</span>
            </div>
          </div>
        </Field>

        {/* Rest */}
        <Field label={t('calisthenics.restSeconds')}>
          <RestPicker value={rest} onChange={setRest} />
        </Field>

        {/* Description */}
        <Field label={`${t('calisthenics.description')} (${description.length}/200)`}>
          <textarea
            value={description}
            maxLength={200}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          />
        </Field>

        {/* Illustration */}
        <Field label={t('calisthenics.illustrationTemplate')}>
          <div className="grid grid-cols-4 gap-2">
            {ILLUS.map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setIllustrationTemplate(key)}
                className={`rounded-xl border py-3 text-center transition-colors ${
                  illustrationTemplate === key
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800'
                }`}
              >
                <div className="text-xl">{icon}</div>
                <div className="text-[10px] mt-0.5 text-slate-600 dark:text-slate-300">{label}</div>
              </button>
            ))}
          </div>
        </Field>

        {/* Notes */}
        <Field label={`${t('calisthenics.notes')} (${notes.length}/200)`}>
          <textarea
            value={notes}
            maxLength={200}
            rows={2}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-purple-600 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? t('calisthenics.saving') : existing ? `✓ ${t('calisthenics.editExercise')}` : `💾 ${t('calisthenics.newExercise')}`}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {children}
    </div>
  )
}
