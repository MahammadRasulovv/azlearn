'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/layout/Navbar'
import CourseCard from '@/components/course/CourseCard'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { T } from '@/lib/design'
import type { Course } from '@/types'

const CATS = ['Hamısı', 'Proqramlaşdırma', 'Veb Dizayn', 'Dillər', 'Biznes']

export default function CoursesPage() {
  const router = useRouter()
  const { token, _hasHydrated } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Hamısı')
  const [focused, setFocused] = useState(false)

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

  const shown = (courses ?? []).filter((c) => {
    const q = search.toLowerCase()
    const okQ = !q || c.title.toLowerCase().includes(q) || (c.category ?? '').toLowerCase().includes(q)
    const okCat = filter === 'Hamısı' || c.category === filter
    return okQ && okCat
  })

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Navbar />

      {/* Page header */}
      <div style={{ padding: '48px 64px 36px', borderBottom: `1px solid ${T.border}` }}>
        <h1 style={{ fontSize: 50, fontWeight: 900, letterSpacing: '-0.045em', marginBottom: 8 }}>
          Kurslar{' '}
          <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>keşf et</span>
        </h1>
        <p style={{ fontSize: 16, color: T.muted, marginBottom: 28 }}>200+ kurs — Azərbaycan dilində</p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 500, marginBottom: 22 }}>
          <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 18, opacity: .5, pointerEvents: 'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Kurs axtar... (məs: Python, SQL, Dizayn)"
            style={{
              width: '100%', padding: '13px 15px 13px 46px',
              background: 'rgba(255,255,255,.07)',
              border: `1px solid ${focused ? 'rgba(99,102,241,.55)' : T.border}`,
              borderRadius: 14, fontSize: 15, color: T.text,
              fontFamily: 'inherit', outline: 'none',
              transition: 'all .22s ease',
              boxShadow: focused ? '0 0 0 3px rgba(99,102,241,.16)' : 'none',
            }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '8px 20px', borderRadius: 100, fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: `all .22s ${T.spring}`,
              background: filter === c ? T.grad : 'rgba(255,255,255,.06)',
              color: filter === c ? '#fff' : T.muted,
              border: filter === c ? 'none' : `1px solid ${T.border}`,
              boxShadow: filter === c ? '0 4px 18px rgba(99,102,241,.35)' : 'none',
              transform: filter === c ? 'scale(1.05)' : 'scale(1)',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '36px 64px 72px' }}>
        <p style={{ fontSize: 14, color: T.dim, marginBottom: 22, fontWeight: 600 }}>{shown.length} kurs tapıldı</p>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 22 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 280, borderRadius: 22, background: 'rgba(255,255,255,.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 18 }}>🔍</div>
            <p style={{ fontSize: 20, color: T.muted }}>Heç bir kurs tapılmadı</p>
            <p style={{ fontSize: 15, color: T.dim, marginTop: 8 }}>Fərqli açar söz sınayın</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 22 }}>
            {shown.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
