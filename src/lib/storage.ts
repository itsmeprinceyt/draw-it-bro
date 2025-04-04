import type { Line } from '@/types/drawing'

export const saveToLocal = (lines: Line[]) => {
  localStorage.setItem('drawing', JSON.stringify(lines))
}

export const loadFromLocal = (): Line[] | null => {
  const data = localStorage.getItem('drawing')
  return data ? (JSON.parse(data) as Line[]) : null
}
