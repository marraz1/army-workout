import type { CalisthenicsLevel } from '@/types/calisthenics'

const STYLES: Record<CalisthenicsLevel, string> = {
  Beginner:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Advanced:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export function LevelBadge({ level }: { level: CalisthenicsLevel }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STYLES[level]}`}>
      {level}
    </span>
  )
}
