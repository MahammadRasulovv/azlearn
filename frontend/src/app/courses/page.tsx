'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import CourseCard from '@/components/course/CourseCard'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import type { Course } from '@/types'

export default function CoursesPage() {
  const router = useRouter()
  const { token, _hasHydrated } = useAuthStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!_hasHydrated) return
    if (!token) router.push('/login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token])

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then((r) => r.data),
    enabled: !!token,
  })

  const filtered = courses?.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kurslar</h1>
            <p className="text-sm text-slate-500">{courses?.length ?? 0} kurs mövcuddur</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Kurs axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400">
            {search ? `"${search}" üzrə nəticə tapılmadı` : 'Hələ kurs yoxdur'}
          </div>
        )}
      </main>
    </div>
  )
}
