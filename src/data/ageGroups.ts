import type { AgeGroup } from '@/types'

/**
 * Age-group training plans. Source of truth:
 * LAF_Workout_App_Requirements.jsx
 */
export const ageGroups: AgeGroup[] = [
  {
    range: '25–30',
    min: 25,
    max: 30,
    label: 'Prime Fitness',
    labelLT: 'Geriausias Pajėgumas',
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#86efac',
    goal: 'Exceed LAF minimums. Build power & endurance.',
    goalLT: 'Viršyti LAF minimumą. Ugdyti jėgą ir ištvermę.',
    exercises: [
      { name: 'Push-ups', sets: '4×30', target: '≥41 (LAF min)', icon: '💪' },
      { name: 'Sit-ups (2 min)', sets: '3×20', target: '≥52 (LAF min)', icon: '🔥' },
      { name: '3 km Run', sets: '3×/week', target: '≤15:30 min', icon: '🏃' },
      { name: 'Pull-ups', sets: '3×8', target: '10+', icon: '🏋️' },
      { name: 'Burpees', sets: '3×15', target: 'Cardio blast', icon: '⚡' },
      { name: 'Plank', sets: '3×60s', target: 'Core stability', icon: '🧱' },
      { name: 'Air Squats', sets: '4×20', target: 'Leg power', icon: '🦵' },
      { name: 'Flutter Kicks', sets: '3×30s', target: 'Core & hip', icon: '🌊' },
    ],
    rest: '60 sec between sets',
    frequency: '5 days/week',
  },
  {
    range: '31–40',
    min: 31,
    max: 40,
    label: 'Sustained Strength',
    labelLT: 'Stabili Jėga',
    color: '#2563eb',
    bg: '#dbeafe',
    border: '#93c5fd',
    goal: 'Maintain endurance, add mobility. Injury prevention priority.',
    goalLT: 'Palaikyti ištvermę, pridėti judrumo. Traumų prevencija.',
    exercises: [
      { name: 'Push-ups', sets: '3×25', target: '≥35 sustained', icon: '💪' },
      { name: 'Sit-ups (2 min)', sets: '3×18', target: '≥48', icon: '🔥' },
      { name: '3 km Run / Walk-Run', sets: '3×/week', target: '≤17:00 min', icon: '🏃' },
      { name: 'Inverted Rows', sets: '3×10', target: 'Upper back', icon: '🏋️' },
      { name: 'Lunges', sets: '3×12/leg', target: 'Functional lower body', icon: '🦵' },
      { name: 'Plank', sets: '3×45s', target: 'Core stability', icon: '🧱' },
      { name: 'Mountain Climbers', sets: '3×20', target: 'Cardio + core', icon: '⛰️' },
      { name: 'Shoulder Stretch', sets: 'Daily 5 min', target: 'Mobility', icon: '🧘' },
    ],
    rest: '75 sec between sets',
    frequency: '4–5 days/week',
  },
  {
    range: '41–50',
    min: 41,
    max: 50,
    label: 'Resilient Readiness',
    labelLT: 'Atsparus Pasirengimas',
    color: '#9333ea',
    bg: '#f3e8ff',
    border: '#d8b4fe',
    goal: 'Maintain military baseline. Joint care. Aerobic base first.',
    goalLT: 'Palaikyti karinį pagrindą. Sąnarių priežiūra. Aerobinis pagrindas.',
    exercises: [
      { name: 'Knee Push-ups → Full', sets: '3×15', target: 'Progress to full', icon: '💪' },
      { name: 'Sit-ups (2 min)', sets: '3×15', target: '≥40 sustained', icon: '🔥' },
      { name: 'Walk-Run 3 km', sets: '3×/week', target: '≤18:30 min', icon: '🚶' },
      { name: 'Wall Sit', sets: '3×30s', target: 'Knee-safe leg strength', icon: '🧱' },
      { name: 'Band / Towel Rows', sets: '3×12', target: 'Back strength', icon: '🏋️' },
      { name: 'Hip Bridge', sets: '3×15', target: 'Glutes & lower back', icon: '🌉' },
      { name: 'Slow Squats', sets: '3×12', target: 'Controlled form', icon: '🦵' },
      { name: 'Full Body Stretching', sets: 'Daily 10 min', target: 'Flexibility', icon: '🧘' },
    ],
    rest: '90 sec between sets',
    frequency: '4 days/week',
  },
]

/** Map a numeric age to its training group (clamps to the nearest band). */
export function ageGroupForAge(age: number): AgeGroup {
  const match = ageGroups.find((g) => age >= g.min && age <= g.max)
  if (match) return match
  return age < ageGroups[0].min ? ageGroups[0] : ageGroups[ageGroups.length - 1]
}
