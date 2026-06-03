'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { T } from '@/lib/design'
import { difficultyLabel } from '@/lib/utils'
import type { Course } from '@/types'

const COURSE_EMOJIS: Record<string, string> = {
  python: '🐍', web: '🌐', sql: '🗄️', ml: '🤖', ai: '🧠',
  design: '✏️', english: '🌍', business: '📊', default: '📚',
}
const COURSE_COLORS: Record<string, string> = {
  beginner: '#22C55E', intermediate: '#F97316', advanced: '#EF4444',
}
const BADGE_COLORS = {
  purple: { bg: 'rgba(99,102,241,.18)', text: '#A5B4FC', border: 'rgba(99,102,241,.3)' },
  green:  { bg: 'rgba(34,197,94,.18)',  text: '#86EFAC', border: 'rgba(34,197,94,.3)' },
  orange: { bg: 'rgba(249,115,22,.18)', text: '#FDBA74', border: 'rgba(249,115,22,.3)' },
  red:    { bg: 'rgba(239,68,68,.18)',  text: '#FCA5A5', border: 'rgba(239,68,68,.3)' },
}

function getEmoji(course: Course): string {
  const t = course.title.toLowerCase()
  if (t.includes('python')) return COURSE_EMOJIS.python
  if (t.includes('web') || t.includes('html')) return COURSE_EMOJIS.web
  if (t.includes('sql')) return COURSE_EMOJIS.sql
  if (t.includes('maşın') || t.includes('machine')) return COURSE_EMOJIS.ml
  if (t.includes('süni') || t.includes('ai')) return COURSE_EMOJIS.ai
  if (t.includes('dizayn') || t.includes('design') || t.includes('figma')) return COURSE_EMOJIS.design
  if (t.includes('ingilis') || t.includes('english')) return COURSE_EMOJIS.english
  if (t.includes('biznes') || t.includes('business')) return COURSE_EMOJIS.business
  return COURSE_EMOJIS.default
}

function getColor(course: Course): string {
  return COURSE_COLORS[course.difficulty] ?? '#6366F1'
}

function getDiffBadge(difficulty: string) {
  if (difficulty === 'beginner') return BADGE_COLORS.green
  if (difficulty === 'intermediate') return BADGE_COLORS.orange
  return BADGE_COLORS.red
}

interface Props {
  course: Course
  index?: number
  progress?: number
}

export default function CourseCard({ course, index = 0, progress }: Props) {
  const [hov, setHov] = useState(false)
  const emoji = getEmoji(course)
  const color = getColor(course)
  const diffBadge = getDiffBadge(course.difficulty)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <Link href={`/courses/${course.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background: hov ? T.cardHov : T.card,
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${hov ? T.borderHov : T.border}`,
            borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
            transition: `all .32s ${T.spring}`,
            transform: hov ? 'translateY(-7px) scale(1.018)' : 'none',
            boxShadow: hov ? `0 28px 52px rgba(0,0,0,.5),0 0 38px ${color}28` : 'none',
          }}
        >
          {/* Header */}
          <div style={{
            height: 112, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg,${color}38 0%,${color}14 100%)`,
            borderBottom: `1px solid ${color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: `2px solid ${color}1a`, top: -55, right: -45 }} />
            <span style={{ fontSize: 46, filter: `drop-shadow(0 5px 14px ${color}90)`, transition: `transform .32s ${T.spring}`, transform: hov ? 'scale(1.22) rotate(8deg)' : 'scale(1)' }}>
              {emoji}
            </span>
          </div>

          <div style={{ padding: '16px 18px 20px' }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
              {course.category && (
                <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,.18)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,.3)' }}>
                  {course.category}
                </span>
              )}
              <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: diffBadge.bg, color: diffBadge.text, border: `1px solid ${diffBadge.border}` }}>
                {difficultyLabel(course.difficulty)}
              </span>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, lineHeight: 1.35, color: T.text }}>{course.title}</h3>
            {course.description && (
              <p style={{ fontSize: 13, color: T.muted, marginBottom: 12, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {course.description}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, fontSize: 12, color: T.dim, marginBottom: 12, flexWrap: 'wrap' }}>
              <span>📚 {course.lessons.length} dərs</span>
            </div>

            {progress !== undefined && progress > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#6366F1,#06B6D4)', borderRadius: 100 }} />
                </div>
                <span style={{ fontSize: 11, color: '#818CF8', marginTop: 3, display: 'block' }}>{progress}% tamamlandı</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
