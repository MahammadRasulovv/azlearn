'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import WolfMascot from '@/components/ui/WolfMascot'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ProgressRing from '@/components/ui/ProgressRing'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { T, triggerConfetti } from '@/lib/design'
import type { Course, LessonProgress, MyProgress, User } from '@/types'

const ACHIEVEMENTS = [
  { id: 1, emoji: '🏆', title: 'İlk Kurs',       desc: 'İlk kursu tamamla',          xp: 100, unlocked: true  },
  { id: 2, emoji: '🔥', title: '7 Günlük Seriya', desc: '7 gün ardıcıl öyrən',        xp: 200, unlocked: true  },
  { id: 3, emoji: '⚡', title: 'XP Toplayıcı',    desc: '1000 XP qazanın',             xp: 150, unlocked: true  },
  { id: 4, emoji: '🚀', title: 'Sürətli Başlanğıc', desc: 'İlk gündə 3 dərs tamamla', xp: 75,  unlocked: true  },
  { id: 5, emoji: '🌟', title: 'Superstar',        desc: '5 kurs tamamla',             xp: 500, unlocked: false },
  { id: 6, emoji: '🎯', title: 'Mükəmməl Bal',     desc: 'Testdə 100% alın',           xp: 300, unlocked: false },
  { id: 7, emoji: '💎', title: 'Premium Öyrənən',  desc: 'Premium kursa yazıl',        xp: 250, unlocked: false },
  { id: 8, emoji: '🎓', title: 'Sertifikat Sahibi',desc: 'İlk sertifikat al',          xp: 400, unlocked: false },
]

function ProgressBar({ value, max = 100, color = 'primary', height = 8 }: { value: number; max?: number; color?: string; height?: number }) {
  const grads: Record<string, string> = {
    primary: 'linear-gradient(90deg,#6366F1,#06B6D4)',
    green:   'linear-gradient(90deg,#22C55E,#4ADE80)',
    orange:  'linear-gradient(90deg,#F97316,#FBBF24)',
    xp:      'linear-gradient(90deg,#8B5CF6,#6366F1,#22D3EE)',
  }
  const pct = Math.min(value / max * 100, 100)
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 130); return () => clearTimeout(t) }, [pct])

  return (
    <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 100, height, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${w}%`,
        background: grads[color] ?? grads.primary,
        borderRadius: 100, position: 'relative', overflow: 'hidden',
        transition: 'width 1.3s cubic-bezier(0.34,1.1,0.64,1)',
      }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: '60%', left: '-60%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)', animation: 'shimmer 2.4s ease infinite' }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, fetchMe, _hasHydrated } = useAuthStore()
  const [isInit, setIsInit] = useState(true)
  const [achClicked, setAchClicked] = useState<number | null>(null)

  useEffect(() => {
    if (!_hasHydrated) return
    if (!token) { router.push('/login'); return }
    fetchMe().finally(() => setIsInit(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token])

  const { data: progress } = useQuery<MyProgress>({
    queryKey: ['progress'],
    queryFn: () => api.get('/progress/me').then(r => r.data),
    enabled: !!token && !!user,
  })
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data),
    enabled: !!token && !!user,
  })
  const { data: lessonProgress } = useQuery<LessonProgress[]>({
    queryKey: ['my-lesson-progress'],
    queryFn: () => api.get('/progress/me/lessons').then(r => r.data),
    enabled: !!token && !!user,
  })
  const { data: leaderboard } = useQuery<User[]>({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/progress/leaderboard').then(r => r.data),
    enabled: !!token && !!user,
  })

  if (!_hasHydrated || isInit || !user) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg }}>
        <Navbar />
        <div style={{ padding: '40px 64px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 80, borderRadius: 16, background: 'rgba(255,255,255,.04)', marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    )
  }

  const progressMap = new Map(lessonProgress?.map(p => [p.lesson_id, p]) ?? [])
  const enrolledCourses = (courses ?? []).map(c => {
    const completed = c.lessons.filter(l => progressMap.get(l.id)?.is_completed).length
    const pct = c.lessons.length > 0 ? Math.round(completed / c.lessons.length * 100) : 0
    return { ...c, pct }
  }).filter(c => c.pct > 0)

  const nextXp = user.level * 500
  const baseXp = (user.level - 1) * 500
  const xpInLevel = user.xp_points - baseXp
  const xpProgress = Math.round(xpInLevel / (nextXp - baseXp) * 100)

  const handleAch = (id: number, unlocked: boolean) => {
    if (!unlocked) return
    setAchClicked(id)
    triggerConfetti()
    setTimeout(() => setAchClicked(null), 2200)
  }

  const top5 = (leaderboard ?? []).slice(0, 5)
  const myRank = (leaderboard ?? []).findIndex(u => u.id === user.id) + 1

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Navbar />

      {/* Profile Header */}
      <div style={{
        padding: '40px 64px 36px',
        background: 'linear-gradient(135deg,rgba(99,102,241,.12) 0%,rgba(6,182,212,.08) 100%)',
        borderBottom: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', maxWidth: 1300, margin: '0 auto' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: T.grad, overflow: 'hidden', boxShadow: '0 0 28px rgba(99,102,241,.55)', animation: 'glow-pulse 3s ease-in-out infinite' }}>
              <WolfMascot width={110} height={110} style={{ objectFit: 'cover', marginTop: '30%', marginLeft: '-22%' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -5, right: -5, background: T.grad, borderRadius: 9, padding: '2px 8px', fontSize: 12, fontWeight: 900, color: 'white', border: '2px solid #060B18' }}>
              Lv.{user.level}
            </div>
          </div>

          {/* Name + XP bar */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 3 }}>Xoş gəldin, qəhrəman! 👋</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.035em', marginBottom: 14 }}>
              {user.full_name ?? user.username}
            </h1>
            <div style={{ maxWidth: 440 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: '#A5B4FC', fontWeight: 700 }}>Səviyyə {user.level} → {user.level + 1}</span>
                <span style={{ fontSize: 13, color: T.muted }}>{xpInLevel.toLocaleString('en-US')} / {(nextXp - baseXp).toLocaleString('en-US')} XP</span>
              </div>
              <ProgressBar value={xpProgress} color="xp" height={13} />
              <p style={{ fontSize: 12, color: T.dim, marginTop: 5 }}>{(nextXp - user.xp_points)} XP daha — növbəti səviyyəyə</p>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[
              { icon: '🔥', val: user.streak_days, sub: 'günlük seriya',      glow: 'rgba(249,115,22,.4)',  border: 'rgba(249,115,22,.25)' },
              { icon: '⚡', val: user.xp_points.toLocaleString('en-US'), sub: 'ümumi XP', glow: 'rgba(99,102,241,.4)',  border: 'rgba(99,102,241,.25)' },
              { icon: '🏆', val: myRank > 0 ? `#${myRank}` : '—', sub: 'liderlik sırası', glow: 'rgba(234,179,8,.4)',  border: 'rgba(234,179,8,.25)' },
              { icon: '🎓', val: progress?.completed_lessons ?? 0, sub: 'tamamlanmış dərs', glow: 'rgba(34,197,94,.4)',  border: 'rgba(34,197,94,.25)' },
            ].map(s => (
              <div key={s.sub} style={{
                background: `radial-gradient(circle at top left,${s.glow},transparent)`,
                border: `1px solid ${s.border}`, borderRadius: 18,
                padding: '14px 20px', textAlign: 'center', backdropFilter: 'blur(14px)', minWidth: 108,
                transition: `transform .22s ${T.spring}`,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              >
                <div style={{ fontSize: 28, marginBottom: 3 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.text, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginTop: 3 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ padding: '40px 64px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 1380, margin: '0 auto' }}>

        {/* Enrolled courses */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 20 }}>📚 Davam edən kurslar</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {enrolledCourses.length === 0 ? (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                <p style={{ color: T.muted, fontSize: 15 }}>Hələ heç bir kursa yazılmamısınız</p>
                <Link href="/courses" style={{ display: 'inline-flex', marginTop: 16, background: T.grad, color: '#fff', borderRadius: 12, padding: '10px 22px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Kurslara Bax</Link>
              </div>
            ) : enrolledCourses.map(c => (
              <Link key={c.id} href={`/courses/${c.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: T.card, backdropFilter: 'blur(16px)',
                  border: `1px solid ${T.border}`, borderRadius: 20,
                  padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center',
                  transition: `all .26s ${T.spring}`, cursor: 'pointer',
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateX(4px)'; el.style.borderColor = T.borderHov }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.borderColor = T.border }}
                >
                  <div style={{ width: 54, height: 54, borderRadius: 15, flexShrink: 0, background: 'rgba(99,102,241,.18)', border: '1px solid rgba(99,102,241,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📚</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: T.text }}>{c.title}</div>
                    <ProgressBar value={c.pct} height={7} />
                    <div style={{ fontSize: 12, color: '#818CF8', marginTop: 4, fontWeight: 700 }}>{c.pct}% tamamlandı</div>
                  </div>
                  <ProgressRing value={c.pct} size={54} stroke={6} color="#6366F1" label={`${c.pct}%`} />
                </div>
              </Link>
            ))}
          </div>

          {/* Streak card */}
          <div style={{ marginTop: 24, background: 'linear-gradient(135deg,rgba(249,115,22,.15),rgba(234,179,8,.1))', border: '1px solid rgba(249,115,22,.28)', borderRadius: 22, padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 52, animation: 'flicker 1.6s ease-in-out infinite', display: 'inline-block' }}>🔥</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#FB923C', marginBottom: 4 }}>{user.streak_days} günlük seriya!</h3>
                <p style={{ fontSize: 14, color: T.muted }}>Bu gün öyrənmə seriyasını qoru</p>
                <ProgressBar value={user.streak_days} max={30} color="orange" height={8} />
                <p style={{ fontSize: 11, color: '#FDBA74', marginTop: 4 }}>30 günlük hədəfə {Math.max(0, 30 - user.streak_days)} gün qaldı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 20 }}>🏅 Nailiyyətlər</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            {ACHIEVEMENTS.map((a, ai) => (
              <div key={a.id} onClick={() => handleAch(a.id, a.unlocked)}
                style={{
                  background: a.unlocked ? 'linear-gradient(135deg,rgba(99,102,241,.14),rgba(6,182,212,.09))' : 'rgba(255,255,255,.03)',
                  border: `1px solid ${a.unlocked ? 'rgba(99,102,241,.28)' : 'rgba(255,255,255,.06)'}`,
                  borderRadius: 18, padding: 18,
                  cursor: a.unlocked ? 'pointer' : 'default',
                  opacity: a.unlocked ? 1 : 0.44,
                  filter: a.unlocked ? 'none' : 'grayscale(.7)',
                  transition: `all .26s ${T.spring}`,
                  transform: achClicked === a.id ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: achClicked === a.id ? '0 0 34px rgba(99,102,241,.55)' : 'none',
                  animation: `bounce-in .55s ${T.spring} both`,
                  animationDelay: `${ai * 0.06}s`,
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (a.unlocked) (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { if (achClicked !== a.id) (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              >
                <div style={{ fontSize: 34, marginBottom: 8 }}>{a.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: a.unlocked ? T.text : T.dim, marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.45, marginBottom: 7 }}>{a.desc}</div>
                {a.unlocked
                  ? <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,.18)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,.3)' }}>+{a.xp} XP</span>
                  : <span style={{ fontSize: 11, color: T.dim }}>🔒 Kilidli</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 20 }}>🏆 Liderlik Cədvəli</h2>
          <div style={{ background: T.card, backdropFilter: 'blur(18px)', border: `1px solid ${T.border}`, borderRadius: 24, overflow: 'hidden' }}>
            {top5.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: T.muted }}>Yüklənir...</div>
            ) : top5.map((u, i) => {
              const isMe = u.id === user.id
              return (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '17px 26px',
                  borderBottom: i < top5.length - 1 ? 'none' : undefined,
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,.05)' : 'none',
                  background: isMe ? 'linear-gradient(90deg,rgba(99,102,241,.14),rgba(6,182,212,.07))' : 'transparent',
                }}>
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
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: isMe ? '#A5B4FC' : T.muted, flexShrink: 0 }}>
                    {u.xp_points.toLocaleString('en-US')} XP
                  </div>
                  <div style={{ width: 120, flexShrink: 0 }}>
                    <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(u.xp_points / (top5[0]?.xp_points || 1)) * 100}%`, background: isMe ? 'linear-gradient(90deg,#8B5CF6,#6366F1,#22D3EE)' : 'linear-gradient(90deg,#6366F1,#06B6D4)', borderRadius: 100 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {top5.length > 0 && (
            <div style={{ marginTop: 20, background: 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(6,182,212,.08))', border: '1px solid rgba(99,102,241,.2)', borderRadius: 20, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
              <WolfMascot width={52} height={52} style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(99,102,241,.5))', animation: 'float 4s ease-in-out infinite' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 4 }}>Əla gedirsən, {user.username}! 💪</p>
                {top5[0] && top5[0].xp_points > user.xp_points && (
                  <p style={{ fontSize: 14, color: T.muted }}>{top5[0].username} ötmək üçün {(top5[0].xp_points - user.xp_points).toLocaleString('en-US')} XP daha lazımdır.</p>
                )}
              </div>
              <Link href="/courses" style={{ display: 'inline-flex', background: T.grad, color: '#fff', borderRadius: 12, padding: '10px 22px', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 18px rgba(99,102,241,.4)' }}>
                Öyrənməyə davam et
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
