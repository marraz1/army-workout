import { Suspense } from 'react'
import CustomExerciseBuilder from '@/screens/CustomExerciseBuilder'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={null}>
      <CustomExerciseBuilder editId={params.id} />
    </Suspense>
  )
}
