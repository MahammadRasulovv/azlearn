'use client'

import Link from 'next/link'
import WolfMascot from '@/components/ui/WolfMascot'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, Trophy, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import { T } from '@/lib/design'

const links = [
  { href: '/dashboard', label: 'Panelim', icon: LayoutDashboard },
  { href: '/courses',   label: 'Kurslar',  icon: BookOpen },
  { href: '/leaderboard', label: 'Liderboard', icon: Trophy },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200, height: '64px',
      background: 'rgba(6,11,24,0.88)', backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: T.grad, overflow: 'hidden',
            boxShadow: '0 0 18px rgba(99,102,241,.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <WolfMascot width={52} height={52} style={{ objectFit: 'cover', marginTop: '30%', marginLeft: '-5%' }} />
          </div>
          <span style={{
            fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em',
            background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>AzLearn</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={cn(
                  'relative flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition-colors',
                  active ? 'text-[#A5B4FC]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                )}
                style={{ textDecoration: 'none', border: active ? '1px solid rgba(99,102,241,0.32)' : '1px solid transparent', background: active ? 'rgba(99,102,241,0.16)' : 'transparent' }}
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-[10px]"
                    style={{ background: 'rgba(99,102,241,0.16)' }}
                    transition={{ type: 'spring', duration: 0.4 }} />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end md:flex">
              <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{user.username}</span>
              <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600 }}>
                {user.xp_points} XP · Lv.{user.level}
              </span>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: '#fff',
              boxShadow: '0 0 12px rgba(99,102,241,.4)',
            }}>
              {user.username[0].toUpperCase()}
            </div>
            <button onClick={logout} aria-label="Çıxış" title="Çıxış" style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,.09)',
              borderRadius: 8, padding: 7, cursor: 'pointer', color: T.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.08)'; (e.currentTarget as HTMLElement).style.color = T.text }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.muted }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
