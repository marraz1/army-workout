'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ExerciseCard } from '@/components/calisthenics/ExerciseCard'
import { calisthenicsExercises, MUSCLE_FILTER_MAP } from '@/data/calisthenicsExercises'
import { useCalisthenics } from '@/context/CalisthenicsContext'
import type { CalisthenicsLevel, CalisthenicsExerciseData } from '@/types/calisthenics'

type LibTab = 'library' | 'my'
const LEVELS: (CalisthenicsLevel | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced']
const MUSCLES = ['All', 'Chest', 'Back', 'Shoulders', 'Core', 'Legs', 'Full Body']

export default function CalisthenicsLibrary() {
  const { t } = useTranslation()
  const router = useRouter()
  const { customExercises, removeCustomExercise } = useCalisthenics()
  const [tab, setTab] = useState<LibTab>('library')
  const [level, setLevel] = useState<string>('All')
  const [muscle, setMuscle] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = calisthenicsExercises.filter((ex) => {
    if (level !== 'All' && ex.level !== level) return false
    if (muscle !== 'All') {
      const aliases = MUSCLE_FILTER_MAP[muscle] ?? [muscle]
      if (!aliases.some((m) => ex.muscles.includes(m))) return false
    }
    return true
  })

  const myFiltered = customExercises.filter((ex) =>
    search === '' || ex.name.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleDelete(id: string) {
    const result = await removeCustomExercise(id, false)
    if (result.warning === 'inActivePlan') {
      setConfirmDeleteId(id)
    }
  }

  async function handleForceDelete(id: string) {
    await removeCustomExercise(id, true)
    setConfirmDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">🤸 {t('calisthenics.title')}</h1>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {(['library', 'my'] as LibTab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === tabKey
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {tabKey === 'library' ? t('calisthenics.libraryTab') : `${t('calisthenics.myTab')} (${customExercises.length}/50)`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {tab === 'library' && (
          <>
            {/* Filters */}
            <div className="space-y-2">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      level === l
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {MUSCLES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMuscle(m)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      muscle === m
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('calisthenics.showing', { count: filtered.length, total: calisthenicsExercises.length })}
              </p>
            </div>

            {/* Exercise list */}
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
                {t('calisthenics.emptyLibrary')}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'my' && (
          <>
            {/* Search + Create */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('calisthenics.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
              <button
                onClick={() => router.push('/calisthenics/exercise/new')}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
              >
                + {t('calisthenics.newExercise')}
              </button>
            </div>

            {customExercises.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
                <div className="text-2xl mb-2">🛠️</div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('calisthenics.emptyMyExercises')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('calisthenics.createFirst')}</p>
                <button
                  onClick={() => router.push('/calisthenics/exercise/new')}
                  className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  + {t('calisthenics.newExercise')}
                </button>
              </div>
            ) : myFiltered.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-8">{t('calisthenics.noSearchResults')}</div>
            ) : (
              <div className="space-y-3">
                {myFiltered.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={{
                      id: 0,
                      name: ex.name,
                      level: ex.level,
                      muscles: ex.muscles,
                      description: ex.description ?? '',
                      defaultSets: ex.defaultSets,
                      defaultReps: ex.defaultRepsOrSecs,
                      defaultRestSec: ex.restSec,
                      isTimed: ex.isTimed,
                      illustrationKey: ex.illustrationTemplate ?? 'push',
                      progressions: [],
                    }}
                    customBadge
                    onAddToPlan={() => router.push(`/calisthenics/plan/new?exerciseId=${ex.id}&source=custom`)}
                    onEdit={() => router.push(`/calisthenics/exercise/${ex.id}/edit`)}
                    onDelete={() => handleDelete(ex.id)}
                  />
                ))}
              </div>
            )}

            {customExercises.length > 0 && (
              <button
                onClick={() => router.push('/calisthenics/exercise/new')}
                className="w-full rounded-xl border-2 border-dashed border-purple-300 py-3 text-sm font-medium text-purple-600 dark:border-purple-700 dark:text-purple-400"
              >
                + {t('calisthenics.newExercise')}
              </button>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-800 shadow-xl">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">{t('calisthenics.deleteExercise')}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              {t('calisthenics.deleteWarningPlan')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium dark:border-slate-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleForceDelete(confirmDeleteId)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white"
              >
                {t('calisthenics.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
