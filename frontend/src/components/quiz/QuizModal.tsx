'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Quiz, QuizResult } from '@/types'

interface Props {
  quiz: Quiz
  onClose: () => void
  onPass?: (result: QuizResult) => void
}

export default function QuizModal({ quiz, onClose, onPass }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)

  const options = ['a', 'b', 'c', 'd'] as const
  const optionLabels: Record<string, string> = { a: 'A', b: 'B', c: 'C', d: 'D' }

  const getOptionText = (q: Quiz['questions'][0], opt: string) => {
    const map: Record<string, string> = {
      a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d,
    }
    return map[opt]
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) return
    setLoading(true)
    try {
      const { data } = await api.post<QuizResult>(`/quizzes/${quiz.id}/submit`, {
        answers: Object.entries(answers).map(([question_id, selected_answer]) => ({
          question_id: Number(question_id),
          selected_answer,
        })),
      })
      setResult(data)
      if (data.passed) onPass?.(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{quiz.title}</h2>
          <p className="text-sm text-slate-500">Keçmək üçün {quiz.pass_score}% lazımdır</p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">
            {result ? (
              /* Result screen */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-4 text-center"
              >
                {result.passed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Trophy className="mx-auto mb-3 h-14 w-14 text-amber-500" />
                  </motion.div>
                ) : (
                  <XCircle className="mx-auto mb-3 h-14 w-14 text-red-400" />
                )}

                <h3 className="mb-1 text-2xl font-bold text-slate-900">{result.score}%</h3>
                <p className={cn('mb-1 font-semibold', result.passed ? 'text-emerald-600' : 'text-red-500')}>
                  {result.passed ? 'Keçdiniz!' : 'Keçmədiniz'}
                </p>
                <p className="text-sm text-slate-500">
                  {result.correct_count}/{result.total_questions} düzgün cavab
                </p>
                {result.xp_earned > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600"
                  >
                    +{result.xp_earned} XP qazandınız!
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Questions */
              <motion.div key="questions" className="space-y-6">
                {quiz.questions.map((q, qi) => (
                  <div key={q.id}>
                    <p className="mb-3 font-medium text-slate-800">
                      <span className="mr-2 text-indigo-500">{qi + 1}.</span>
                      {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {options.map((opt) => {
                        const selected = answers[q.id] === opt
                        return (
                          <motion.button
                            key={opt}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all',
                              selected
                                ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                            )}
                          >
                            <span className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                              selected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                            )}>
                              {optionLabels[opt]}
                            </span>
                            {getOptionText(q, opt)}
                            {selected && (
                              <CheckCircle className="ml-auto h-4 w-4 text-indigo-500" />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Bağla
          </Button>
          {!result && (
            <Button
              onClick={handleSubmit}
              disabled={loading || Object.keys(answers).length < quiz.questions.length}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Göndərilir...' : 'Göndər'}
            </Button>
          )}
          {result && !result.passed && (
            <Button
              onClick={() => { setResult(null); setAnswers({}) }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              Yenidən cəhd et
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
