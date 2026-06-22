import type { RoutineItem } from '@/types'

export const dailyRoutine: RoutineItem[] = [
  { time: '06:00', icon: '⏰', label: 'Wake Up', detail: 'Alarm + hydration (500ml water)', color: '#f59e0b' },
  { time: '06:05', icon: '🧘', label: 'Morning Mobility', detail: '5 min joint warm-up, neck rolls, hip circles', color: '#10b981' },
  { time: '06:15', icon: '💪', label: 'Workout Session', detail: '30–45 min structured exercise per schedule', color: '#ef4444' },
  { time: '07:00', icon: '🚿', label: 'Cool Down + Shower', detail: '5 min stretch + hygiene', color: '#06b6d4' },
  { time: '07:15', icon: '🍳', label: 'Breakfast', detail: 'High protein meal (eggs, oats, dairy)', color: '#f97316' },
  { time: '12:30', icon: '🥗', label: 'Lunch', detail: 'Balanced meal — protein + carbs + vegetables', color: '#22c55e' },
  { time: '15:00', icon: '💧', label: 'Hydration Check', detail: 'App reminder: drink 500ml water', color: '#3b82f6' },
  { time: '19:00', icon: '🍽️', label: 'Dinner', detail: 'Light meal, reduce carbs in evening', color: '#8b5cf6' },
  { time: '21:00', icon: '📱', label: 'Log Workout', detail: 'Mark complete / skip / cheat day in app', color: '#ec4899' },
  { time: '22:00', icon: '😴', label: 'Sleep', detail: '8 hours recommended for muscle recovery', color: '#6366f1' },
]
