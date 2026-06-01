'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, LayoutDashboard, Trophy, LogOut, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Kurslar', icon: BookOpen },
  { href: '/leaderboard', label: 'Liderboard', icon: Trophy },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">AzLearn</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-indigo-50"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
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
              <span className="text-sm font-semibold text-slate-900">{user.username}</span>
              <span className="text-xs text-indigo-600 font-medium">{user.xp_points} XP · Lv.{user.level}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {user.username[0].toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
