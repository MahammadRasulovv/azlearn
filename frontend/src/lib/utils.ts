import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function xpToNextLevel(level: number): number {
  return level * 500
}

export function xpProgress(xp: number, level: number): number {
  const base = (level - 1) * 500
  const next = level * 500
  return Math.round(((xp - base) / (next - base)) * 100)
}

export function difficultyLabel(d: string): string {
  const map: Record<string, string> = {
    beginner: 'Başlanğıc',
    intermediate: 'Orta',
    advanced: 'İrəliləmiş',
  }
  return map[d] ?? d
}

export function difficultyColor(d: string): string {
  const map: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
  }
  return map[d] ?? 'bg-gray-100 text-gray-700'
}

export function youtubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match?.[1] ?? null
}
