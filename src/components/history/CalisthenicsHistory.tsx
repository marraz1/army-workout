'use client'

import { useState } from 'react'
import { useCalisthenics } from '@/context/CalisthenicsContext'
import { MuscleHeatmap } from './MuscleHeatmap'
import { CalisthenicsSessionList } from './CalisthenicsSessionList'

type SubView = 'sessions' | 'heatmap'

export function CalisthenicsHistory() {
  const { logs, loading } = useCalisthenics()
  const [subView, setSubView] = useState<SubView>('sessions')
  const [muscleFilter, setMuscleFilter] = useState<string | undefined>()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sub-view tabs */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 w-fit">
        {(['sessions', 'heatmap'] as SubView[]).map((v) => (
          <button
            key={v}
            onClick={() => { setSubView(v); setMuscleFilter(undefined) }}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              subView === v
                ? 'bg-purple-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {v === 'sessions' ? 'Sessions' : 'Muscle Map'}
          </button>
        ))}
      </div>

      {muscleFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Filtering: <strong>{muscleFilter}</strong>
          </span>
          <button
            onClick={() => setMuscleFilter(undefined)}
            className="text-xs text-purple-600 dark:text-purple-400"
          >
            Clear
          </button>
        </div>
      )}

      {subView === 'heatmap' ? (
        <MuscleHeatmap
          logs={logs}
          onMuscleClick={(m) => { setMuscleFilter(m); setSubView('sessions') }}
        />
      ) : (
        <CalisthenicsSessionList logs={logs} muscleFilter={muscleFilter} />
      )}
    </div>
  )
}
