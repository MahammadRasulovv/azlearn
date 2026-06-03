'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import type { Token } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { setToken, fetchMe } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post<Token>('/auth/login', form)
      setToken(data.access_token)
      await fetchMe()
      router.push('/dashboard')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
      const msg = Array.isArray(detail)
        ? (detail as { msg: string }[]).map((d) => d.msg).join(', ')
        : typeof detail === 'string'
        ? detail
        : 'Giriş alınmadı'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.055)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: '40px 36px',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, fontSize: 15,
    color: '#F1F5F9', fontFamily: 'inherit', outline: 'none',
  }
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#94A3B8' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#060B18', padding: '0 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)', top: -150, left: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,.14) 0%,transparent 70%)', bottom: -100, right: -100, pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 380, position: 'relative' }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'linear-gradient(135deg,#6366F1 0%,#06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 24px rgba(99,102,241,.5)' }}>
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', color: '#F1F5F9' }}>Xoş gəldiniz</h1>
          <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 4 }}>Hesabınıza daxil olun</p>
        </div>

        <div style={card}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="siz@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Şifrə</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" aria-label={showPw ? 'Şifrəni gizlət' : 'Şifrəni göstər'} title={showPw ? 'Şifrəni gizlət' : 'Şifrəni göstər'} onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(239,68,68,.14)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '8px 12px', fontSize: 13, color: '#FCA5A5' }}>
                {error}
              </motion.p>
            )}
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#6366F1 0%,#06B6D4 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1, boxShadow: '0 0 22px rgba(99,102,241,.45)', transition: 'opacity .2s' }}>
              {loading ? 'Giriş edilir...' : 'Daxil ol'}
            </button>
          </form>
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#94A3B8' }}>
          Hesabınız yoxdur?{' '}
          <Link href="/register" style={{ fontWeight: 700, color: '#818CF8', textDecoration: 'none' }}>Qeydiyyat</Link>
        </p>
      </motion.div>
    </div>
  )
}
