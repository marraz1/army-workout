'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import { AuthShell, AuthField } from '@/components/auth/AuthShell'

export default function Register() {
  const { t } = useTranslation()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('auth.passwordsMismatch'))
      return
    }

    setSubmitting(true)
    // 1) Create the account.
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setSubmitting(false)
      setError(data.error ?? t('auth.registerFailed'))
      return
    }

    // 2) Sign in immediately, then go to onboarding.
    const login = await signIn('credentials', {
      email: email.trim(),
      password,
      redirect: false,
    })
    setSubmitting(false)
    if (!login || login.error) {
      setError(t('auth.registerFailed'))
      return
    }
    router.replace('/onboarding')
    router.refresh()
  }

  return (
    <AuthShell title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')}>
      <form onSubmit={submit}>
        <AuthField
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={setEmail}
          autoFocus
          autoComplete="email"
        />
        <AuthField
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <AuthField
          label={t('auth.confirmPassword')}
          type="password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />
        {error && (
          <div className="mb-3 rounded-lg bg-red-500/25 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-flag-yellow text-navy hover:bg-yellow-400"
        >
          {submitting ? t('auth.loading') : t('auth.signUp')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm opacity-90">
        {t('auth.haveAccount')}{' '}
        <Link href="/login" className="font-bold text-flag-yellow underline">
          {t('auth.loginLink')}
        </Link>
      </p>
    </AuthShell>
  )
}
