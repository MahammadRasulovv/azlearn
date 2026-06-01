'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, Zap, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import QuizModal from '@/components/quiz/QuizModal'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { youtubeId } from '@/lib/utils'
import type { Lesson, Quiz, LessonCompleteResponse } from '@/types'

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const qc = useQueryClient()
  const { token, fetchMe } = useAuthStore()
  const id = params.id as string
  const [showQuiz, setShowQuiz] = useState(false)
  const [xpToast, setXpToast] = useState<number | null>(null)

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ['lesson', id],
    queryFn: () => api.get(`/lessons/${id}`).then((r) => r.data),
    enabled: !!token && !!id,
  })

  const { data: quiz } = useQuery<Quiz>({
    queryKey: ['quiz-lesson', id],
    queryFn: () => api.get(`/quizzes/lesson/${id}`).then((r) => r.data),
    enabled: !!token && !!id,
    retry: false,
  })

  const completeMutation = useMutation({
    mutationFn: () => api.post<LessonCompleteResponse>(`/progress/lesson/${id}/complete`).then((r) => r.data),
    onSuccess: (data) => {
      if (data.xp_earned > 0) {
        setXpToast(data.xp_earned)
        setTimeout(() => setXpToast(null), 3000)
      }
      qc.invalidateQueries({ queryKey: ['progress'] })
      qc.invalidateQueries({ queryKey: ['my-lesson-progress'] })
      fetchMe()
    },
  })

  const videoId = lesson ? youtubeId(lesson.youtube_url) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="aspect-video animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    )
  }

  if (!lesson) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* XP Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-white shadow-xl"
          >
            <Zap className="h-4 w-4" />
            <span className="font-semibold">+{xpToast} XP qazandınız!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href={`/courses/${lesson.course_id}`}
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Kursa qayıt
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-2xl font-bold text-slate-900"
        >
          {lesson.title}
        </motion.h1>

        {/* Video */}
        {videoId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6 overflow-hidden rounded-2xl shadow-lg"
          >
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={lesson.title}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-3"
        >
          <Button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending || completeMutation.isSuccess}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle className="h-4 w-4" />
            {completeMutation.isSuccess ? 'Tamamlandı!' : `Dərsi tamamla (+${lesson.xp_reward} XP)`}
          </Button>

          {quiz && (
            <Button
              onClick={() => setShowQuiz(true)}
              variant="outline"
              className="gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            >
              <BookOpen className="h-4 w-4" />
              Quiz başlat
            </Button>
          )}
        </motion.div>

        {/* Notes */}
        {lesson.notes && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-3 font-semibold text-slate-900">Qeydlər</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{lesson.notes}</p>
          </motion.div>
        )}
      </main>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && quiz && (
          <QuizModal
            quiz={quiz}
            onClose={() => setShowQuiz(false)}
            onPass={() => {
              qc.invalidateQueries({ queryKey: ['progress'] })
              qc.invalidateQueries({ queryKey: ['my-lesson-progress'] })
              fetchMe()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
