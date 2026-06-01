'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import type { Token } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const { setToken, fetchMe } = useAuthStore()
  const [form, setForm] = useState({ email: '', username: '', full_name: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      const { data } = await api.post<Token>('/auth/login', {
        email: form.email,
        password: form.password,
      })
      setToken(data.access_token)
      await fetchMe()
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Qeydiyyat alınmadı')
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        required={key !== 'full_name'}
        className="h-11"
      />
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Hesab aç</h1>
          <p className="mt-1 text-sm text-slate-500">Pulsuz qeydiyyatdan keç</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('full_name', 'Ad Soyad', 'text', 'Əli Həsənov')}
          {field('username', 'İstifadəçi adı', 'text', 'alihesenov')}
          {field('email', 'Email', 'email', 'siz@example.com')}
          {field('password', 'Şifrə', 'password', '••••••••')}

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
          >
            {loading ? 'Qeydiyyat olunur...' : 'Qeydiyyat'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Hesabınız var?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
            Daxil ol
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
