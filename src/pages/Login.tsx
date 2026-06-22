import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import { AuthShell, AuthField } from '@/components/auth/AuthShell'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn, configured } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email.trim(), password)
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      {!configured && (
        <div className="mb-4 rounded-lg bg-amber-400/20 px-3 py-2 text-xs text-amber-100">
          ⚠️ {t('auth.notConfigured')}
        </div>
      )}
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
          autoComplete="current-password"
        />
        {error && (
          <div className="mb-3 rounded-lg bg-red-500/25 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}
        <Button
          type="submit"
          disabled={submitting || !configured}
          className="w-full bg-flag-yellow text-navy hover:bg-yellow-400"
        >
          {submitting ? t('auth.loading') : t('auth.signIn')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm opacity-90">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-bold text-flag-yellow underline">
          {t('auth.registerLink')}
        </Link>
      </p>
    </AuthShell>
  )
}
