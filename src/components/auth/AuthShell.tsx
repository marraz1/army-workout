'use client'

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-br from-navy to-forest text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <div className="mb-8 text-center">
          <div className="text-3xl font-extrabold">🇱🇹 {t('app.name')}</div>
          <div className="mt-1 text-sm opacity-80">{t('app.tagline')}</div>
        </div>
        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="mt-1 text-sm opacity-80">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

interface AuthFieldProps {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  autoComplete?: string
}

export function AuthField({
  label,
  type,
  value,
  onChange,
  autoFocus,
  autoComplete,
}: AuthFieldProps) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-0 bg-white/95 px-4 py-3 text-base text-slate-900 outline-none focus:ring-2 focus:ring-flag-yellow"
      />
    </label>
  )
}
