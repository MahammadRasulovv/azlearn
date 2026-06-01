'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, PlayCircle, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { difficultyLabel, difficultyColor } from '@/lib/utils'
import type { Course, LessonProgress } from '@/types'

export default function CoursePage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuthStore()
  const id = params.id as string

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => api.get(`/courses/${id}`).then((r) => r.data),
    enabled: !!token && !!id,
  })

  const { data: myProgress } = useQuery<LessonProgress[]>({
    queryKey: ['my-lesson-progress'],
    queryFn: () => api.get('/progress/me/lessons').then((r) => r.data),
    enabled: !!token,
  })

  const progressMap = new Map(myProgress?.map((p) => [p.lesson_id, p]) ?? [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    )
  }

  if (!course) return null

  const completedCount = course.lessons.filter((l) => progressMap.get(l.id)?.is_completed).length
  const totalXP = course.lessons.reduce((s, l) => s + l.xp_reward, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Back */}
        <Link href="/courses" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          Kurslara qayıt
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className={difficultyColor(course.difficulty)}>
              {difficultyLabel(course.difficulty)}
            </Badge>
            {course.category && (
              <Badge className="bg-slate-100 text-slate-600">{course.category}</Badge>
            )}
          </div>

          <h1 className="mb-2 text-2xl font-bold text-slate-900">{course.title}</h1>
          {course.description && (
            <p className="mb-4 text-slate-500">{course.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>{course.lessons.length} dərs</span>
            <span>·</span>
            <span className="text-indigo-600 font-medium">{totalXP} XP</span>
            <span>·</span>
            <span>{completedCount}/{course.lessons.length} tamamlandı</span>
          </div>

          {course.lessons.length > 0 && (
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / course.lessons.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          )}
        </motion.div>

        {/* Lessons */}
        <h2 className="mb-3 font-semibold text-slate-900">Dərslər</h2>
        <div className="space-y-2">
          {course.lessons
            .sort((a, b) => a.order_index - b.order_index)
            .map((lesson, i) => {
              const prog = progressMap.get(lesson.id)
              const done = prog?.is_completed ?? false
              const quizDone = prog?.quiz_passed ?? false
              const unlocked = i === 0 || progressMap.get(course.lessons[i - 1]?.id)?.is_completed

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {unlocked ? (
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md group"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${done ? 'bg-emerald-100' : 'bg-indigo-50 group-hover:bg-indigo-100'}`}>
                        {done
                          ? <CheckCircle className="h-5 w-5 text-emerald-600" />
                          : <PlayCircle className="h-5 w-5 text-indigo-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {lesson.xp_reward} XP
                          {quizDone && <span className="ml-2 text-emerald-500">· Quiz ✓</span>}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">#{lesson.order_index}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 opacity-60">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-500">{lesson.title}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
        </div>
      </main>
    </div>
  )
}
