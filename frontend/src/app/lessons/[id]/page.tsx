'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import QuizModal from '@/components/quiz/QuizModal'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { youtubeId } from '@/lib/utils'
import { T, triggerConfetti } from '@/lib/design'
import type { Lesson, Quiz, LessonCompleteResponse, Course, LessonProgress } from '@/types'

type Step = 'video' | 'notes' | 'quiz'

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'video', label: 'Video',    icon: '🎬' },
  { id: 'notes', label: 'Konspekt', icon: '📒' },
  { id: 'quiz',  label: 'Quiz',     icon: '📝' },
]

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const qc = useQueryClient()
  const { token, fetchMe, _hasHydrated } = useAuthStore()
  const id = params.id as string

  const [step, setStep] = useState<Step>('video')
  const [videoDone, setVideoDone] = useState(false)
  const [notesDone, setNotesDone] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [xpToast, setXpToast] = useState<number | null>(null)

  useEffect(() => {
    if (!_hasHydrated) return
    if (!token) router.push('/login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token])

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ['lesson', id],
    queryFn: () => api.get(`/lessons/${id}`).then(r => r.data),
    enabled: !!token && !!id,
  })

  const { data: course } = useQuery<Course>({
    queryKey: ['course', lesson?.course_id],
    queryFn: () => api.get(`/courses/${lesson!.course_id}`).then(r => r.data),
    enabled: !!token && !!lesson?.course_id,
  })

  const { data: quiz } = useQuery<Quiz>({
    queryKey: ['quiz-lesson', id],
    queryFn: () => api.get(`/quizzes/lesson/${id}`).then(r => r.data),
    enabled: !!token && !!id,
    retry: false,
  })

  const { data: lessonProgress } = useQuery<LessonProgress[]>({
    queryKey: ['my-lesson-progress'],
    queryFn: () => api.get('/progress/me/lessons').then(r => r.data),
    enabled: !!token,
  })

  const progressMap = new Map(lessonProgress?.map(p => [p.lesson_id, p]) ?? [])

  useEffect(() => {
    if (lesson && progressMap.get(lesson.id)?.is_completed) {
      setCompleted(true)
      setVideoDone(true)
      setNotesDone(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonProgress, lesson])

  const completeMutation = useMutation({
    mutationFn: () => api.post<LessonCompleteResponse>(`/progress/lesson/${id}/complete`).then(r => r.data),
    onSuccess: (data) => {
      setCompleted(true)
      if (data.xp_earned > 0) {
        setXpToast(data.xp_earned)
        triggerConfetti()
        setTimeout(() => setXpToast(null), 3500)
      }
      qc.invalidateQueries({ queryKey: ['progress'] })
      qc.invalidateQueries({ queryKey: ['my-lesson-progress'] })
      fetchMe()
    },
  })

  const videoId = lesson ? youtubeId(lesson.youtube_url) : null
  const sortedLessons = course?.lessons.slice().sort((a, b) => a.order_index - b.order_index) ?? []
  const currentIndex = sortedLessons.findIndex(l => l.id === lesson?.id)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
  const canGoNext = completed || (videoDone && notesDone && (!quiz || progressMap.get(lesson?.id ?? 0)?.quiz_passed))

  if (isLoading || !lesson) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Navbar />
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 48px' }}>
          {[400, 80, 60].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 16, background: 'rgba(255,255,255,.04)', marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    )
  }

  const stepIndex = STEPS.findIndex(s => s.id === step)

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Navbar />

      {/* XP Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -60, x: '-50%' }}
            style={{
              position: 'fixed', left: '50%', top: 80, zIndex: 500,
              background: 'linear-gradient(135deg,#22C55E,#16A34A)',
              color: '#fff', borderRadius: 100, padding: '12px 28px',
              fontSize: 18, fontWeight: 900, boxShadow: '0 0 40px rgba(34,197,94,.6)',
            }}
          >⚡ +{xpToast} XP qazandınız!</motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 48px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 20 }}>
          <Link href="/courses" style={{ color: T.dim, textDecoration: 'none' }}>Kurslar</Link>
          <span style={{ color: T.dim }}>›</span>
          <Link href={`/courses/${lesson.course_id}`} style={{ color: T.muted, textDecoration: 'none' }}>{course?.title ?? '...'}</Link>
          <span style={{ color: T.dim }}>›</span>
          <span style={{ color: T.text, fontWeight: 600 }}>{lesson.title}</span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, background: 'rgba(255,255,255,.04)', borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
          {STEPS.map((s, i) => {
            const isActive = s.id === step
            const isDone = (s.id === 'video' && (videoDone || completed)) ||
                           (s.id === 'notes' && (notesDone || completed)) ||
                           (s.id === 'quiz'  && (progressMap.get(lesson.id)?.quiz_passed || completed))
            const isLocked = (s.id === 'notes' && !videoDone && !completed) ||
                             (s.id === 'quiz'  && !notesDone && !completed)

            return (
              <button key={s.id}
                onClick={() => !isLocked && setStep(s.id)}
                disabled={isLocked}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 20px', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: isActive ? 800 : 600,
                  background: isActive ? 'rgba(99,102,241,.22)' : 'transparent',
                  color: isActive ? '#A5B4FC' : isDone ? '#86EFAC' : isLocked ? T.dim : T.muted,
                  borderRight: i < 2 ? `1px solid ${T.border}` : 'none',
                  transition: 'all .2s',
                  borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                }}
              >
                <span style={{ fontSize: 18 }}>{isDone && !isActive ? '✅' : s.icon}</span>
                {s.label}
                {isLocked && <span style={{ fontSize: 11, color: T.dim }}>🔒</span>}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* ── MAIN CONTENT ── */}
          <div>
            <AnimatePresence mode="wait">

              {/* STEP 1: VIDEO */}
              {step === 'video' && (
                <motion.div key="video" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div style={{ borderRadius: 20, overflow: 'hidden', background: '#000', boxShadow: `0 24px 64px rgba(0,0,0,.7), 0 0 0 1px ${T.border}`, marginBottom: 20 }}>
                    {videoId ? (
                      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                          title={lesson.title}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,.1)', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontSize: 48 }}>🎬</div>
                        <p style={{ color: T.muted }}>Video tapılmadı</p>
                      </div>
                    )}
                  </div>

                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '18px 22px', marginBottom: 16 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 6 }}>{lesson.title}</h1>
                    {lesson.description && <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>{lesson.description}</p>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 7, background: 'rgba(139,92,246,.18)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,.3)' }}>
                        ⚡ {lesson.xp_reward} XP
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 7, background: 'rgba(255,255,255,.06)', color: T.muted, border: `1px solid ${T.border}` }}>
                        Dərs {currentIndex + 1}/{sortedLessons.length}
                      </span>
                    </div>
                  </div>

                  {!videoDone ? (
                    <button onClick={() => { setVideoDone(true); setStep('notes') }}
                      style={{ width: '100%', background: T.grad, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 28px rgba(99,102,241,.5)' }}>
                      Videonu izlədim → Konspektə keç
                    </button>
                  ) : (
                    <button onClick={() => setStep('notes')}
                      style={{ width: '100%', background: 'rgba(34,197,94,.18)', color: '#86EFAC', border: '1px solid rgba(34,197,94,.3)', borderRadius: 14, padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                      ✅ Video tamamlandı — Konspektə keç
                    </button>
                  )}
                </motion.div>
              )}

              {/* STEP 2: NOTES */}
              {step === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: '28px 32px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ fontSize: 26 }}>📒</span>
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: T.text }}>Konspekt</h2>
                        <p style={{ fontSize: 13, color: T.muted }}>Dərsin əsas məqamlarını oxu</p>
                      </div>
                    </div>
                    {lesson.notes ? (
                      <pre style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 14, color: T.muted, lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                        {lesson.notes}
                      </pre>
                    ) : (
                      <p style={{ color: T.dim, fontSize: 15, textAlign: 'center', padding: '40px 0' }}>Bu dərs üçün konspekt hazırlanır...</p>
                    )}
                  </div>

                  {!notesDone ? (
                    <button onClick={() => {
                      setNotesDone(true)
                      if (quiz) setStep('quiz')
                      else { completeMutation.mutate() }
                    }}
                      style={{ width: '100%', background: T.grad, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 28px rgba(99,102,241,.5)' }}>
                      {quiz ? 'Oxudum → Quize keç 📝' : `Oxudum → Dərsi Tamamla (+${lesson.xp_reward} XP) ✓`}
                    </button>
                  ) : (
                    <button onClick={() => quiz ? setStep('quiz') : undefined}
                      style={{ width: '100%', background: 'rgba(34,197,94,.18)', color: '#86EFAC', border: '1px solid rgba(34,197,94,.3)', borderRadius: 14, padding: '15px', fontSize: 16, fontWeight: 800, cursor: quiz ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                      ✅ Konspekt oxundu {quiz ? '→ Quize keç' : ''}
                    </button>
                  )}
                </motion.div>
              )}

              {/* STEP 3: QUIZ */}
              {step === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  {quiz ? (
                    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: '32px', textAlign: 'center' }}>
                      <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
                      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{quiz.title}</h2>
                      <p style={{ color: T.muted, marginBottom: 8 }}>
                        {quiz.questions.length} sual · keçmək üçün {quiz.pass_score}% lazımdır
                      </p>
                      <p style={{ color: '#C4B5FD', fontSize: 14, marginBottom: 28 }}>
                        ⚡ Keçsəniz +{quiz.xp_bonus} XP qazanacaqsınız
                      </p>

                      {progressMap.get(lesson.id)?.quiz_passed ? (
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#86EFAC', marginBottom: 16 }}>✅ Quiz artıq keçilmişdir!</div>
                          {nextLesson && (
                            <Link href={`/lessons/${nextLesson.id}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.grad, color: '#fff', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 0 28px rgba(99,102,241,.5)' }}>
                              Növbəti dərsə keç →
                            </Link>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => setShowQuiz(true)}
                          style={{ background: T.grad, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 40px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 28px rgba(99,102,241,.5)' }}>
                          Quizi Başlat →
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: '32px', textAlign: 'center' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                      <p style={{ color: T.muted }}>Bu dərs üçün quiz yoxdur.</p>
                      {!completed && (
                        <button onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending}
                          style={{ marginTop: 20, background: 'linear-gradient(135deg,#22C55E,#16A34A)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          {completeMutation.isPending ? '...' : `Dərsi Tamamla (+${lesson.xp_reward} XP)`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Next lesson after quiz passed */}
                  {completed && nextLesson && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
                      <Link href={`/lessons/${nextLesson.id}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(34,197,94,.18),rgba(6,182,212,.12))', border: '1px solid rgba(34,197,94,.3)', borderRadius: 16, padding: '18px', textDecoration: 'none', color: '#86EFAC', fontWeight: 800, fontSize: 16 }}>
                        🎉 Növbəti dərsə keç: {nextLesson.title} →
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>

            {/* Prev/Next nav */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 18px', textDecoration: 'none', transition: 'border-color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.borderHov }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.border }}
                >
                  <span>←</span>
                  <div>
                    <div style={{ fontSize: 11, color: T.dim, fontWeight: 600 }}>Əvvəlki</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{prevLesson.title}</div>
                  </div>
                </Link>
              ) : <div style={{ flex: 1 }} />}

              {nextLesson && canGoNext ? (
                <Link href={`/lessons/${nextLesson.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 18px', textDecoration: 'none', transition: 'border-color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.borderHov }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.border }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: T.dim, fontWeight: 600 }}>Növbəti</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{nextLesson.title}</div>
                  </div>
                  <span>→</span>
                </Link>
              ) : nextLesson ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.03)', border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 18px', color: T.dim, fontSize: 13 }}>
                  🔒 Quizi keçdikdən sonra açılır
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 14, padding: '12px 18px', color: '#A5B4FC', fontSize: 14, fontWeight: 800 }}>
                  🎉 Son dərs!
                </div>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position: 'sticky', top: 84 }}>
            {/* Course progress */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>Kurs İrəliləyişi</div>
              <div style={{ fontSize: 13, color: T.text, fontWeight: 700, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course?.title}</div>
              <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 100, height: 6, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{
                  height: '100%', borderRadius: 100,
                  width: `${sortedLessons.length > 0 ? (sortedLessons.filter(l => progressMap.get(l.id)?.is_completed).length / sortedLessons.length) * 100 : 0}%`,
                  background: 'linear-gradient(90deg,#6366F1,#06B6D4)',
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ fontSize: 12, color: T.dim }}>
                {sortedLessons.filter(l => progressMap.get(l.id)?.is_completed).length}/{sortedLessons.length} dərs tamamlandı
              </div>
            </div>

            {/* Lesson list */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Dərslər ({sortedLessons.length})
              </div>
              <div style={{ maxHeight: 440, overflowY: 'auto' }}>
                {sortedLessons.map((l, i) => {
                  const isDone = progressMap.get(l.id)?.is_completed ?? false
                  const isActive = l.id === lesson.id
                  const isUnlocked = i === 0 || progressMap.get(sortedLessons[i - 1]?.id)?.is_completed

                  return isUnlocked ? (
                    <Link key={l.id} href={`/lessons/${l.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px',
                        borderTop: i > 0 ? '1px solid rgba(255,255,255,.04)' : 'none',
                        background: isActive ? 'rgba(99,102,241,.18)' : 'transparent',
                        borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                        cursor: 'pointer',
                      }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.04)' }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: isDone ? 'linear-gradient(135deg,#22C55E,#16A34A)' : isActive ? 'rgba(99,102,241,.4)' : 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? T.text : T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                          <div style={{ fontSize: 10, color: T.dim }}>⚡ {l.xp_reward} XP</div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px', borderTop: i > 0 ? '1px solid rgba(255,255,255,.04)' : 'none', opacity: 0.35 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: T.dim }}>🔒</div>
                      <div style={{ fontSize: 12, color: T.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && quiz && (
          <QuizModal quiz={quiz} onClose={() => setShowQuiz(false)}
            onPass={(result) => {
              setShowQuiz(false)
              completeMutation.mutate()
              qc.invalidateQueries({ queryKey: ['progress'] })
              qc.invalidateQueries({ queryKey: ['my-lesson-progress'] })
              fetchMe()
              void result
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
