'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { AppProvider } from '@/context/AppContext'
import { WorkoutDataProvider } from '@/context/WorkoutDataContext'
import { CalisthenicsProvider } from '@/context/CalisthenicsContext'
import { RoutineProvider } from '@/context/RoutineContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <AppProvider>
          <WorkoutDataProvider>
            <CalisthenicsProvider>
              <RoutineProvider>{children}</RoutineProvider>
            </CalisthenicsProvider>
          </WorkoutDataProvider>
        </AppProvider>
      </I18nextProvider>
    </SessionProvider>
  )
}
