'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CalisthenicsExerciseData } from '@/types/calisthenics'
import { LevelBadge } from './LevelBadge'
import { MuscleTag } from './MuscleTag'

interface ExerciseCardProps {
  exercise: CalisthenicsExerciseData
  customBadge?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const ILLUS_ICONS: Record<string, string> = {
  push: '💪', pull: '🏋️', squat: '🦵', hold: '🤸',
}

export function ExerciseCard({ exercise, customBadge, onEdit, onDelete }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  const icon = ILLUS_ICONS[exercise.illustrationKey?.split('-')[0] ?? ''] ?? '🤸'
  const repLabel = exercise.isTimed
    ? `${exercise.defaultSets}×${exercise.defaultReps}s`
    : `${exercise.defaultSets}×${exercise.defaultReps}`

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl">{icon}</span>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{exercise.name}</span>
              <LevelBadge level={exercise.level} />
              {customBadge && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  🛠️ Custom
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {repLabel} · {exercise.defaultRestSec}s rest
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Muscle tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {exercise.muscles.map((m) => <MuscleTag key={m} muscle={m} />)}
      </div>

      {/* Description */}
      {exercise.description && (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {exercise.description}
        </p>
      )}

      {/* Expandable */}
      {exercise.progressions.length > 0 && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400"
          >
            {expanded ? '▲ Hide progressions' : '▼ Show progressions'}
          </button>
          {expanded && (
            <div className="mt-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
              <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Progression Path
              </div>
              <div className="flex flex-wrap gap-1">
                {exercise.progressions.map((p, i) => (
                  <span key={i} className="text-xs text-slate-600 dark:text-slate-300">
                    {i > 0 && <span className="mx-0.5 text-slate-400">→</span>}
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add to plan */}
      <button
        onClick={() => router.push(`/calisthenics/plan/new?exerciseId=${exercise.id}&source=library`)}
        className="mt-3 w-full rounded-xl py-2 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: exercise.level === 'Beginner' ? '#16a34a' : exercise.level === 'Intermediate' ? '#2563eb' : '#9333ea' }}
      >
        + Add to Plan
      </button>
    </div>
  )
}
