'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { T } from '@/lib/design'
import type { User } from '@/types'

export default function LeaderboardPage() {
  const router = useRouter()
  const { token, user: me, _hasHydrated } = useAuthStore()

  useEffect(() => {
    if (!_hasHydrated) return
    if (!token) router.push('/login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token])

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/progress/leaderboard').then(r => r.data),
    enabled: !!token,
  })

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Navbar />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 6 }}>
            🏆 <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Liderlik Cədvəli</span>
          </h1>
          <p style={{ color: T.muted, fontSize: 15 }}>Ən yaxşı öyrənənlər</p>
        </motion.div>

        <div style={{ background: T.card, backdropFilter: 'blur(18px)', border: `1px solid ${T.border}`, borderRadius: 24, overflow: 'hidden' }}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 72, borderTop: i > 0 ? '1px solid rgba(255,255,255,.05)' : 'none', background: 'rgba(255,255,255,.02)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))
          ) : (users ?? []).map((u, i) => {
            const isMe = u.id === me?.id
            return (
              <motion.div key={u.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '17px 26px', borderTop: i > 0 ? '1px solid rgba(255,255,255,.05)' : 'none', background: isMe ? 'linear-gradient(90deg,rgba(99,102,241,.14),rgba(6,182,212,.07))' : 'transparent' }}>
                <div style={{ width: 38, textAlign: 'center', flexShrink: 0, fontSize: i < 3 ? 24 : 15, fontWeight: 900, color: i === 0 ? '#FCD34D' : i === 1 ? '#CBD5E1' : i === 2 ? '#FDBA74' : T.dim }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: 'white', boxShadow: isMe ? '0 0 16px rgba(99,102,241,.6)' : 'none' }}>
                  {u.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: isMe ? 900 : 700, color: isMe ? T.text : T.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {u.username}
                    {isMe && <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(6,182,212,.18)', color: '#67E8F9', border: '1px solid rgba(6,182,212,.3)' }}>Sən</span>}
                  </div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>Lv.{u.level}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: isMe ? '#A5B4FC' : T.muted, flexShrink: 0 }}>
                  {u.xp_points.toLocaleString('en-US')} XP
                </div>
                <div style={{ width: 120, flexShrink: 0 }}>
                  <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(u.xp_points / ((users?.[0]?.xp_points) || 1)) * 100}%`, background: isMe ? 'linear-gradient(90deg,#8B5CF6,#6366F1,#22D3EE)' : 'linear-gradient(90deg,#6366F1,#06B6D4)', borderRadius: 100 }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
