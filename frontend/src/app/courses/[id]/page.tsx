'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { T, triggerConfetti } from '@/lib/design'
import { difficultyLabel } from '@/lib/utils'
import ProgressRing from '@/components/ui/ProgressRing'
import type { Course, LessonProgress } from '@/types'

const DIFF_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: 'rgba(34,197,94,.18)',  text: '#86EFAC', border: 'rgba(34,197,94,.3)'  },
  intermediate: { bg: 'rgba(249,115,22,.18)', text: '#FDBA74', border: 'rgba(249,115,22,.3)' },
  advanced:     { bg: 'rgba(239,68,68,.18)',  text: '#FCA5A5', border: 'rgba(239,68,68,.3)'  },
}

export default function CoursePage() {
  const router = useRouter()
  const params = useParams()
  const { token, _hasHydrated } = useAuthStore()
  const id = params.id as string
  const [openSec, setOpenSec] = useState(0)
  const [enrolled, setEnrolled] = useState(false)
  const [justEnrolled, setJustEnrolled] = useState(false)

  useEffect(() => {
    if (!_hasHydrated) return
    if (!token) router.push('/login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token])

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => api.get(`/courses/${id}`).then(r => r.data),
    enabled: !!token && !!id,
  })

  const { data: myProgress } = useQuery<LessonProgress[]>({
    queryKey: ['my-lesson-progress'],
    queryFn: () => api.get('/progress/me/lessons').then(r => r.data),
    enabled: !!token,
  })

  const progressMap = new Map(myProgress?.map(p => [p.lesson_id, p]) ?? [])

  useEffect(() => {
    if (!course || !myProgress) return
    const completed = course.lessons.filter(l => progressMap.get(l.id)?.is_completed).length
    if (completed > 0) setEnrolled(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, myProgress])

  if (isLoading || !course) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Navbar />
        <div style={{ padding: '40px 64px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 60, borderRadius: 16, background: 'rgba(255,255,255,.04)', marginBottom: 14, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    )
  }

  const sortedLessons = [...course.lessons].sort((a, b) => a.order_index - b.order_index)
  const completedCount = sortedLessons.filter(l => progressMap.get(l.id)?.is_completed).length
  const progressPct = sortedLessons.length > 0 ? Math.round(completedCount / sortedLessons.length * 100) : 0
  const totalXP = sortedLessons.reduce((s, l) => s + l.xp_reward, 0)
  const diffBadge = DIFF_BADGE[course.difficulty] ?? DIFF_BADGE.beginner

  const handleEnroll = () => {
    setEnrolled(true); setJustEnrolled(true)
    triggerConfetti()
    setTimeout(() => setJustEnrolled(false), 2500)
  }

  // Group lessons into 3 sections (simulated curriculum)
  const third = Math.ceil(sortedLessons.length / 3)
  const curriculum = [
    { sec: 'Giriş',             items: sortedLessons.slice(0, third) },
    { sec: 'Əsas Anlayışlar',    items: sortedLessons.slice(third, third * 2) },
    { sec: 'Praktiki Layihələr', items: sortedLessons.slice(third * 2) },
  ].filter(s => s.items.length > 0)

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Navbar />

      <div style={{ padding: '22px 64px 0' }}>
        <Link href="/courses" style={{ background: 'transparent', border: 'none', color: T.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'color .2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.text }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted }}
        >← Kurslara qayıt</Link>
      </div>

      {/* Course header */}
      <div style={{ padding: '32px 64px 44px', background: 'linear-gradient(135deg,rgba(99,102,241,.12) 0%,rgba(6,182,212,.08) 100%)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, maxWidth: 1180, margin: '0 auto', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 18, flexWrap: 'wrap' }}>
              {course.category && (
                <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,.18)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,.3)' }}>{course.category}</span>
              )}
              <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: diffBadge.bg, color: diffBadge.text, border: `1px solid ${diffBadge.border}` }}>{difficultyLabel(course.difficulty)}</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12, lineHeight: 1.1 }}>
              📚 {course.title}
            </motion.h1>
            {course.description && (
              <p style={{ fontSize: 16, color: T.muted, marginBottom: 26, lineHeight: 1.65 }}>{course.description}</p>
            )}

            <div style={{ display: 'flex', gap: 22, marginBottom: 30, flexWrap: 'wrap' }}>
              {[
                { i: '📚', v: `${sortedLessons.length} dərs` },
                { i: '⚡', v: `${totalXP} XP` },
                { i: '✅', v: `${completedCount}/${sortedLessons.length} tamamlandı` },
              ].map(s => (
                <div key={s.i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: T.muted }}>
                  <span>{s.i}</span><span>{s.v}</span>
                </div>
              ))}
            </div>

            {progressPct > 0 && (
              <div style={{ maxWidth: 400, marginBottom: 28 }}>
                <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 100, height: 8, overflow: 'hidden', marginBottom: 6 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.3, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#6366F1,#06B6D4)', borderRadius: 100 }} />
                </div>
                <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 700 }}>{progressPct}% tamamlandı</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              {enrolled ? (
                <>
                  <Link href={`/lessons/${sortedLessons[0]?.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22C55E 0%,#16A34A 100%)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 30px', fontSize: 17, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 22px rgba(34,197,94,.4)' }}>▶ Dərsə davam et</Link>
                  <ProgressRing value={progressPct} size={64} stroke={7} color="#6366F1" label={`${progressPct}%`} sublabel="tamamlandı" />
                  {justEnrolled && (
                    <div style={{ fontSize: 18, animation: 'xp-fly .9s ease both', background: 'rgba(34,197,94,.18)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 10, padding: '5px 13px', color: '#4ADE80', fontWeight: 800 }}>+100 XP 🎉</div>
                  )}
                </>
              ) : (
                <>
                  <button onClick={handleEnroll} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.grad, color: '#fff', border: 'none', borderRadius: 14, padding: '13px 30px', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 28px rgba(99,102,241,.55)' }}>
                    🚀 Pulsuz Yazıl
                  </button>
                  <span style={{ fontSize: 14, color: T.muted }}>30 günlük geri ödəmə zəmanəti</span>
                </>
              )}
            </div>
          </div>

          {/* Video player placeholder */}
          <div style={{ background: 'rgba(0,0,0,.55)', border: `1px solid ${T.border}`, borderRadius: 22, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'linear-gradient(135deg,rgba(99,102,241,.16),transparent)' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 0 34px rgba(99,102,241,.55)', animation: 'glow-pulse 2.5s ease-in-out infinite' }}>▶</div>
              <p style={{ marginTop: 14, fontSize: 14, color: T.muted }}>Demo dərsini izlə</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,.6)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.12)', borderRadius: 2 }}>
                <div style={{ width: '28%', height: '100%', background: T.grad, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 12, color: T.muted, whiteSpace: 'nowrap' }}>2:50 / 12:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div style={{ padding: '52px 64px 88px', maxWidth: 820 }}>
        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 26, letterSpacing: '-0.03em' }}>Proqram</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {curriculum.map((sec, si) => (
            <div key={si} style={{ background: T.card, backdropFilter: 'blur(16px)', border: `1px solid ${T.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <button onClick={() => setOpenSec(openSec === si ? -1 : si)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: T.text, fontSize: 16, fontWeight: 800 }}>
                <span>{sec.sec}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>{sec.items.length} dərs</span>
                  <span style={{ display: 'inline-block', fontSize: 12, opacity: .55, transition: `transform .3s ${T.spring}`, transform: openSec === si ? 'rotate(180deg)' : 'none' }}>▼</span>
                </div>
              </button>
              {openSec === si && (
                <div style={{ borderTop: `1px solid ${T.border}` }}>
                  {sec.items.map((lesson, ii) => {
                    const prog = progressMap.get(lesson.id)
                    const done = prog?.is_completed ?? false
                    const unlocked = ii === 0 || progressMap.get(sec.items[ii - 1]?.id)?.is_completed
                    return (
                      <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 22px', borderBottom: ii < sec.items.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: done ? 'linear-gradient(135deg,#22C55E 0%,#16A34A 100%)' : 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white' }}>
                          {done ? '✓' : unlocked ? ii + 1 : '🔒'}
                        </div>
                        {unlocked ? (
                          <Link href={`/lessons/${lesson.id}`} style={{ flex: 1, fontSize: 14, color: done ? T.muted : T.text, textDecoration: 'none' }}>{lesson.title}</Link>
                        ) : (
                          <span style={{ flex: 1, fontSize: 14, color: T.dim }}>{lesson.title}</span>
                        )}
                        <span style={{ fontSize: 12, color: T.dim, flexShrink: 0 }}>{lesson.xp_reward} XP</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
