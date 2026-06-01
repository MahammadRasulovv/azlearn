'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Trophy, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: BookOpen, title: 'Strukturlaşdırılmış Kurslar', desc: 'YouTube videolarını ardıcıl dərs proqramına çevir' },
  { icon: Zap, title: 'XP & Level Sistemi', desc: 'Hər dərs üçün XP qazanıb yeni levelə çat' },
  { icon: Trophy, title: 'Quiz & Liderboard', desc: 'Bilikləri quiz ilə yoxla, liderboardda yer al' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">AzLearn</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Giriş</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Başla</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              🇦🇿 Azərbaycan dilində
            </span>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Proqramlaşdırmanı{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Azərbaycanca
              </span>{' '}
              öyrən
            </h1>
            <p className="mb-10 text-xl text-slate-500 leading-relaxed">
              Strukturlaşdırılmış kurslar, quiz sistemi, XP və liderboard ilə öyrənməni həyəcanlı bir macəraya çevir.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  Pulsuz başla <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  Kurslara bax
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-md"
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-900">İndi qeydiyyatdan keç</h2>
          <p className="mb-8 text-slate-500">Tamamilə pulsuz. Kart lazım deyil.</p>
          <div className="mb-6 flex flex-col gap-2 text-sm text-slate-600">
            {['Sonsuz kurs və dərslər', 'XP və level sistemi', 'Quiz və liderboard'].map((t) => (
              <div key={t} className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t}
              </div>
            ))}
          </div>
          <Link href="/register">
            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Hesab aç
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
