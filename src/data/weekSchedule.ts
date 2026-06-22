import type { ScheduleDay } from '@/types'

export const weekSchedule: ScheduleDay[] = [
  { day: 'Mon', type: 'Strength', icon: '💪', focus: 'Push-ups, Sit-ups, Pull-ups / Rows', color: '#ef4444' },
  { day: 'Tue', type: 'Cardio', icon: '🏃', focus: '3 km Run / Walk-Run intervals', color: '#f97316' },
  { day: 'Wed', type: 'Core + Mobility', icon: '🧘', focus: 'Plank, Flutter Kicks, Stretching', color: '#eab308' },
  { day: 'Thu', type: 'Strength', icon: '💪', focus: 'Squats, Lunges, Burpees', color: '#ef4444' },
  { day: 'Fri', type: 'Cardio + Full Test', icon: '🏆', focus: 'Run + Push-up + Sit-up timed test', color: '#22c55e' },
  { day: 'Sat', type: 'Active Recovery', icon: '🚴', focus: 'Light walk, cycling or swimming', color: '#06b6d4' },
  { day: 'Sun', type: 'Rest', icon: '😴', focus: 'Full rest or optional stretching', color: '#8b5cf6' },
]

/** JS getDay() returns 0=Sun..6=Sat. Map to our Mon-first array index. */
export function scheduleForDate(date = new Date()): ScheduleDay {
  const jsDay = date.getDay() // 0 = Sunday
  const monFirstIndex = (jsDay + 6) % 7 // 0 = Monday
  return weekSchedule[monFirstIndex]
}

export interface TrainingPhase {
  phase: string
  phaseLT: string
  name: string
  nameLT: string
  desc: string
  descLT: string
  color: string
}

export const trainingPhases: TrainingPhase[] = [
  {
    phase: 'Weeks 1–4',
    phaseLT: '1–4 Savaitė',
    name: 'Foundation',
    nameLT: 'Pagrindas',
    desc: 'Build baseline. Master form. 3–4 sets, 60–90s rest.',
    descLT: 'Ugdyti pagrindą. Forma pirma. 3–4 serijos, 60–90s poilsis.',
    color: '#22c55e',
  },
  {
    phase: 'Weeks 5–8',
    phaseLT: '5–8 Savaitė',
    name: 'Volume',
    nameLT: 'Apimtis',
    desc: 'Add 1 set. Cut rest by 15s. Increase reps +2 every week.',
    descLT: 'Pridėti 1 seriją. Sutrumpinti poilsį 15s. Reps +2 kas savaitę.',
    color: '#3b82f6',
  },
  {
    phase: 'Weeks 9–12',
    phaseLT: '9–12 Savaitė',
    name: 'Test Prep',
    nameLT: 'Testo Paruošimas',
    desc: 'Simulate LAF test weekly. Max-effort sets. Taper last week.',
    descLT: 'Kas savaitę simuliuoti LAF testą. Pilnas intensyvumas.',
    color: '#ef4444',
  },
]
