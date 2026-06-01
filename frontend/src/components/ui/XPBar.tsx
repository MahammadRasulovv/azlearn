'use client'

import { motion } from 'framer-motion'
import { xpProgress, xpToNextLevel } from '@/lib/utils'

interface Props {
  xp: number
  level: number
  className?: string
}

export default function XPBar({ xp, level, className }: Props) {
  const pct = xpProgress(xp, level)
  const nextLevel = xpToNextLevel(level)
  const base = (level - 1) * 500

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">Lv.{level}</span>
        <span className="text-slate-400">{xp - base} / {nextLevel - base} XP</span>
        <span className="font-medium text-slate-600">Lv.{level + 1}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
