import { ArmIcon, BackLegs, BackTorso, FrontLegs, FrontTorso } from '@/components/muscle/MuscleIconComponents'
import type { MuscleHighlight } from '@/components/muscle/MuscleIconComponents'

const map: Record<string, MuscleHighlight[]> = {
  'push-ups': [
    { component: FrontTorso, highlight: ['chest', 'shoulders', 'traps'] },
    { component: ArmIcon,    highlight: ['triceps'], props: { side: 'back' } },
  ],
  'knee-push-ups': [
    { component: FrontTorso, highlight: ['chest', 'shoulders'] },
    { component: ArmIcon,    highlight: ['triceps'], props: { side: 'back' } },
  ],
  'sit-ups': [
    { component: FrontTorso, highlight: ['abs', 'obliques'] },
  ],
  'run-3km': [
    { component: FrontLegs, highlight: ['quads', 'calves'] },
    { component: BackLegs,  highlight: ['hamstrings', 'glutes'] },
  ],
  'pull-ups': [
    { component: BackTorso, highlight: ['lats', 'traps'] },
    { component: ArmIcon,   highlight: ['biceps'], props: { side: 'front' } },
  ],
  'burpees': [
    { component: FrontTorso, highlight: ['chest', 'abs'] },
    { component: FrontLegs,  highlight: ['quads', 'calves'] },
  ],
  'plank': [
    { component: FrontTorso, highlight: ['abs', 'obliques'] },
    { component: BackTorso,  highlight: ['lower_back'] },
  ],
  'air-squats': [
    { component: FrontLegs, highlight: ['quads', 'hip_flexors'] },
    { component: BackLegs,  highlight: ['glutes', 'hamstrings'] },
  ],
  'slow-squats': [
    { component: FrontLegs, highlight: ['quads', 'hip_flexors'] },
    { component: BackLegs,  highlight: ['glutes', 'hamstrings'] },
  ],
  'flutter-kicks': [
    { component: FrontTorso, highlight: ['abs'] },
    { component: FrontLegs,  highlight: ['hip_flexors'] },
  ],
  'lunges': [
    { component: FrontLegs, highlight: ['quads', 'hip_flexors'] },
    { component: BackLegs,  highlight: ['glutes', 'hamstrings'] },
  ],
  'inverted-rows': [
    { component: BackTorso, highlight: ['lats', 'traps', 'rear_delt'] },
    { component: ArmIcon,   highlight: ['biceps'], props: { side: 'front' } },
  ],
  'mountain-climbers': [
    { component: FrontTorso, highlight: ['abs', 'shoulders'] },
    { component: FrontLegs,  highlight: ['hip_flexors', 'quads'] },
  ],
  'shoulder-stretch': [
    { component: FrontTorso, highlight: ['shoulders', 'traps'] },
  ],
  'wall-sit': [
    { component: FrontLegs, highlight: ['quads', 'hip_flexors'] },
  ],
  'band-rows': [
    { component: BackTorso, highlight: ['lats', 'rear_delt'] },
    { component: ArmIcon,   highlight: ['biceps'], props: { side: 'front' } },
  ],
  'hip-bridge': [
    { component: BackLegs,  highlight: ['glutes', 'hamstrings'] },
    { component: BackTorso, highlight: ['lower_back'] },
  ],
  'full-body-stretching': [],
}

export function getMuscleHighlights(slug: string): MuscleHighlight[] {
  return map[slug] ?? []
}

/** All named muscle groups, for the selector. */
export const ALL_MUSCLES: { id: string; label: string; component: MuscleHighlight['component']; highlight: string[] }[] = [
  { id: 'chest',       label: 'Chest',       component: FrontTorso, highlight: ['chest'] },
  { id: 'abs',         label: 'Abs',         component: FrontTorso, highlight: ['abs'] },
  { id: 'obliques',    label: 'Obliques',    component: FrontTorso, highlight: ['obliques'] },
  { id: 'shoulders',   label: 'Shoulders',   component: FrontTorso, highlight: ['shoulders'] },
  { id: 'traps',       label: 'Traps',       component: FrontTorso, highlight: ['traps'] },
  { id: 'lats',        label: 'Lats',        component: BackTorso,  highlight: ['lats'] },
  { id: 'rear_delt',   label: 'Rear Delts',  component: BackTorso,  highlight: ['rear_delt'] },
  { id: 'lower_back',  label: 'Lower Back',  component: BackTorso,  highlight: ['lower_back'] },
  { id: 'quads',       label: 'Quads',       component: FrontLegs,  highlight: ['quads'] },
  { id: 'hip_flexors', label: 'Hip Flexors', component: FrontLegs,  highlight: ['hip_flexors'] },
  { id: 'adductors',   label: 'Adductors',   component: FrontLegs,  highlight: ['adductors'] },
  { id: 'glutes',      label: 'Glutes',      component: BackLegs,   highlight: ['glutes'] },
  { id: 'hamstrings',  label: 'Hamstrings',  component: BackLegs,   highlight: ['hamstrings'] },
  { id: 'calves',      label: 'Calves',      component: BackLegs,   highlight: ['calves'] },
  { id: 'biceps',      label: 'Biceps',      component: ArmIcon,    highlight: ['biceps'] },
  { id: 'triceps',     label: 'Triceps',     component: ArmIcon,    highlight: ['triceps'] },
  { id: 'forearms',    label: 'Forearms',    component: ArmIcon,    highlight: ['forearms'] },
]
