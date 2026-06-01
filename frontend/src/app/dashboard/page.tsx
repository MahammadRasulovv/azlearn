'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Flame, Zap, Trophy, BookOpen } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import XPBar from '@/components/ui/XPBar'
import CourseCard from '@/components/course/CourseCard'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import type { MyProgress, Course } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (!token) { router.push('/login'); return }
    fetchMe()
  }, [token, router, fetchMe])

  const { data: progress } = useQuery<MyProgress>({
    queryKey: ['progress'],
    queryFn: () => api.get('/progress/me').then((r) => r.data),
    enabled: !!token,
  })

  const { data: courses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then((r) => r.data),
    enabled: !!token,
  })

  if (!user) return null

  const stats = [
    { label: 'Toplam XP', value: `${user.xp_points} XP`, icon: Zap, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Level', value: `Lv. ${user.level}`, icon: Trophy, color: 'text-amber-600 bg-amber-50' },
    { label: 'Streak', value: `${user.streak_days} gün`, icon: Flame, color: 'text-orange-600 bg-orange-50' },
    { label: 'Tamamlanan', value: `${progress?.completed_lessons ?? 0} dərs`, icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900">
            Salam, {user.full_name ?? user.username}! 👋
          </h1>
          <p className="mt-1 text-slate-500">Öyrənməyə davam et</p>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-900">Level {user.level} irəliləyişi</span>
            <span className="text-sm font-medium text-indigo-600">{user.xp_points} XP</span>
          </div>
          <XPBar xp={user.xp_points} level={user.level} />
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Courses */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Kurslar</h2>
          {courses && courses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-400">
              Hələ kurs yoxdur
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
