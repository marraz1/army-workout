import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import { AuthShell, AuthField } from '@/components/auth/AuthShell'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp, configured } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('auth.passwordsMismatch'))
      return
    }

    setSubmitting(true)
    const { error, needsConfirmation } = await signUp(email.trim(), password)
    setSubmitting(false)

    if (error) {
      setError(error)
      return
    }
    if (needsConfirmation) {
      setNotice(t('auth.checkEmail'))
      return
    }
    // Session is active — send the new user into onboarding.
    navigate('/onboarding', { replace: true })
  }

  return (
    <AuthShell title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')}>
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
        {notice && (
          <div className="mb-3 rounded-lg bg-green-500/25 px-3 py-2 text-sm text-green-100">
            ✅ {notice}
          </div>
        )}
        <Button
          type="submit"
          disabled={submitting || !configured}
          className="w-full bg-flag-yellow text-navy hover:bg-yellow-400"
        >
          {submitting ? t('auth.loading') : t('auth.signUp')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm opacity-90">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-bold text-flag-yellow underline">
          {t('auth.loginLink')}
        </Link>
      </p>
    </AuthShell>
  )
}
