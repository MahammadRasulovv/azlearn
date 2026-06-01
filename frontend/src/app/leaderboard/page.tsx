'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Crown, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import XPBar from '@/components/ui/XPBar'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

const medalColors = ['text-amber-500', 'text-slate-400', 'text-amber-700']

export default function LeaderboardPage() {
  const router = useRouter()
  const { token, user: me } = useAuthStore()

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/progress/leaderboard').then((r) => r.data),
    enabled: !!token,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Liderboard</h1>
            <p className="text-sm text-slate-500">Top 10 istifadəçi</p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users?.map((user, i) => {
              const isMe = user.id === me?.id
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border p-4 shadow-sm',
                    isMe
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  )}
                >
                  {/* Rank */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                    {i < 3 ? (
                      <Crown className={cn('h-6 w-6', medalColors[i])} />
                    ) : (
                      <span className="text-lg font-bold text-slate-400">#{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    isMe ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-700'
                  )}>
                    {user.username[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 truncate">{user.username}</span>
                      {isMe && <span className="text-xs font-medium text-indigo-600">siz</span>}
                    </div>
                    <XPBar xp={user.xp_points} level={user.level} className="mt-1" />
                  </div>

                  {/* XP */}
                  <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600">
                    <Zap className="h-3.5 w-3.5" />
                    {user.xp_points}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
