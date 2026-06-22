'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { AppProvider } from '@/context/AppContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <AppProvider>{children}</AppProvider>
      </I18nextProvider>
    </SessionProvider>
  )
}
