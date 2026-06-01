'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { difficultyLabel, difficultyColor } from '@/lib/utils'
import type { Course } from '@/types'

interface Props {
  course: Course
  index?: number
}

export default function CourseCard({ course, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={`/courses/${course.id}`}
        className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Icon */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400" />
          </div>

          {course.description && (
            <p className="mb-3 text-sm text-slate-500 line-clamp-2">{course.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={difficultyColor(course.difficulty)}>
              {difficultyLabel(course.difficulty)}
            </Badge>
            {course.category && (
              <Badge className="bg-slate-100 text-slate-600">{course.category}</Badge>
            )}
            <span className="ml-auto text-xs text-slate-400">
              {course.lessons.length} dərs
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
