import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
  accent?: string
}

export function Card({ title, children, className, accent }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800',
        className,
      )}
      style={accent ? { borderLeft: `4px solid ${accent}` } : undefined}
    >
      {title && (
        <div className="mb-4 text-[15px] font-bold text-navy dark:text-slate-100">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
