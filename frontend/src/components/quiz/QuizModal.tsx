'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { T, triggerConfetti } from '@/lib/design'
import type { Quiz, QuizResult } from '@/types'

interface Props {
  quiz: Quiz
  onClose: () => void
  onPass?: (result: QuizResult) => void
}

const OPTS = ['a', 'b', 'c', 'd'] as const
const OPT_LABEL: Record<string, string> = { a: 'A', b: 'B', c: 'C', d: 'D' }

function getOptionText(q: Quiz['questions'][0], opt: string) {
  return ({ a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d })[opt] ?? ''
}

export default function QuizModal({ quiz, onClose, onPass }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)

  const total = quiz.questions.length
  const answered = Object.keys(answers).length
  const q = quiz.questions[current]

  const handleSubmit = async () => {
    if (answered < total) return
    setLoading(true)
    try {
      const { data } = await api.post<QuizResult>(`/quizzes/${quiz.id}/submit`, {
        answers: Object.entries(answers).map(([question_id, selected_answer]) => ({
          question_id: Number(question_id),
          selected_answer,
        })),
      })
      setResult(data)
      if (data.passed) { triggerConfetti(); onPass?.(data) }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: '100%', maxWidth: 560,
          background: 'rgba(10,16,36,0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          boxShadow: '0 32px 80px rgba(0,0,0,.8), 0 0 60px rgba(99,102,241,.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Quiz</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: T.text, letterSpacing: '-0.02em' }}>{quiz.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Bağla" title="Bağla" style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: T.muted, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.14)'; (e.currentTarget as HTMLElement).style.color = T.text }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLElement).style.color = T.muted }}
          >✕</button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          <AnimatePresence mode="wait">
            {result ? (
              /* ── Result Screen ── */
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 72, marginBottom: 16, animation: result.passed ? 'bounce-in .6s cubic-bezier(0.34,1.56,0.64,1) both' : 'none' }}>
                  {result.passed ? '🏆' : '😔'}
                </div>

                <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8, color: result.passed ? '#4ADE80' : '#F87171' }}>
                  {result.score}%
                </div>

                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: result.passed ? '#86EFAC' : '#FCA5A5' }}>
                  {result.passed ? 'Keçdiniz! 🎉' : 'Keçmədiniz'}
                </div>

                <div style={{ fontSize: 14, color: T.muted, marginBottom: 20 }}>
                  {result.correct_count}/{result.total_questions} düzgün cavab · keçmək üçün {quiz.pass_score}% lazımdır
                </div>

                {result.xp_earned > 0 && (
                  <motion.div initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .3 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,.2)', border: '1px solid rgba(139,92,246,.4)', borderRadius: 100, padding: '8px 20px', fontSize: 16, fontWeight: 800, color: '#C4B5FD', marginBottom: 24 }}>
                    ⚡ +{result.xp_earned} XP qazandınız!
                  </motion.div>
                )}

                {/* Score bar */}
                <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 100, height: 8, overflow: 'hidden', marginBottom: 24 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ height: '100%', background: result.passed ? 'linear-gradient(90deg,#22C55E,#4ADE80)' : 'linear-gradient(90deg,#EF4444,#F87171)', borderRadius: 100 }} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  {!result.passed && (
                    <button onClick={() => { setResult(null); setAnswers({}); setCurrent(0) }}
                      style={{ flex: 1, background: T.grad, color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(99,102,241,.4)' }}>
                      🔄 Yenidən cəhd et
                    </button>
                  )}
                  <button onClick={onClose}
                    style={{ flex: 1, background: 'rgba(255,255,255,.07)', color: T.text, border: `1px solid ${T.border}`, borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {result.passed ? '✓ Bağla' : 'Bağla'}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Questions Screen ── */
              <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Progress dots */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 20, flexWrap: 'wrap' }}>
                  {quiz.questions.map((qq, i) => (
                    <button key={qq.id} onClick={() => setCurrent(i)}
                      title={`Sual ${i + 1}`}
                      aria-label={`Sual ${i + 1}`}
                      style={{
                        width: 28, height: 6, borderRadius: 100, border: 'none', cursor: 'pointer', padding: 0,
                        background: answers[qq.id] ? '#6366F1' : i === current ? 'rgba(99,102,241,.4)' : 'rgba(255,255,255,.1)',
                        transition: 'background .2s',
                      }} />
                  ))}
                </div>

                {/* Question counter */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Sual {current + 1} / {total}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{answered}/{total} cavablandı</span>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                    <p style={{ fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.55, marginBottom: 18 }}>
                      <span style={{ color: '#818CF8', marginRight: 8 }}>{current + 1}.</span>
                      {q.question_text}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {OPTS.map(opt => {
                        const selected = answers[q.id] === opt
                        const text = getOptionText(q, opt)
                        if (!text) return null
                        return (
                          <motion.button key={opt} whileTap={{ scale: 0.98 }}
                            onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '13px 16px', borderRadius: 14, textAlign: 'left',
                              background: selected ? 'rgba(99,102,241,.22)' : 'rgba(255,255,255,.04)',
                              border: `1px solid ${selected ? 'rgba(99,102,241,.55)' : 'rgba(255,255,255,.08)'}`,
                              cursor: 'pointer', fontFamily: 'inherit',
                              transition: `all .15s ${T.spring}`,
                              boxShadow: selected ? '0 0 20px rgba(99,102,241,.2)' : 'none',
                            }}
                            onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)' }}
                            onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.04)' }}
                          >
                            <span style={{
                              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                              background: selected ? '#6366F1' : 'rgba(255,255,255,.08)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 800, color: selected ? '#fff' : T.muted,
                              transition: 'all .15s',
                            }}>
                              {OPT_LABEL[opt]}
                            </span>
                            <span style={{ fontSize: 14, color: selected ? T.text : T.muted, fontWeight: selected ? 600 : 400, flex: 1 }}>
                              {text}
                            </span>
                            {selected && <span style={{ fontSize: 16 }}>✓</span>}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  {current > 0 && (
                    <button onClick={() => setCurrent(c => c - 1)}
                      style={{ flex: 1, background: 'rgba(255,255,255,.06)', color: T.muted, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      ← Əvvəlki
                    </button>
                  )}
                  {current < total - 1 ? (
                    <button onClick={() => setCurrent(c => c + 1)}
                      style={{ flex: 1, background: answers[q.id] ? T.grad : 'rgba(255,255,255,.06)', color: answers[q.id] ? '#fff' : T.dim, border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: answers[q.id] ? '0 0 18px rgba(99,102,241,.4)' : 'none', transition: 'all .2s' }}>
                      Növbəti →
                    </button>
                  ) : (
                    <button onClick={handleSubmit}
                      disabled={loading || answered < total}
                      style={{
                        flex: 1, background: answered >= total ? T.grad : 'rgba(255,255,255,.06)',
                        color: answered >= total ? '#fff' : T.dim,
                        border: 'none', borderRadius: 12, padding: '12px',
                        fontSize: 14, fontWeight: 700, cursor: answered >= total ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit', opacity: loading ? .7 : 1,
                        boxShadow: answered >= total ? '0 0 22px rgba(99,102,241,.5)' : 'none',
                        transition: 'all .2s',
                      }}>
                      {loading ? '⏳ Göndərilir...' : answered < total ? `${answered}/${total} cavablandı` : '✓ Göndər'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
