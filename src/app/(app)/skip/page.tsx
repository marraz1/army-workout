import { Suspense } from 'react'
import SkipCheatDay from '@/screens/SkipCheatDay'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SkipCheatDay />
    </Suspense>
  )
}
