import { Suspense } from 'react'
import CalisthenicsLogger from '@/screens/CalisthenicsLogger'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CalisthenicsLogger />
    </Suspense>
  )
}
