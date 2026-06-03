'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import WolfMascot from '@/components/ui/WolfMascot'
import { motion } from 'framer-motion'
import { T } from '@/lib/design'

const FEATURED = [
  { id: 1, emoji: '🐍', title: 'Python ilə Proqramlaşdırma', subtitle: 'Sıfırdan peşəkar səviyyəyə', cat: 'Proqramlaşdırma', level: 'Başlanğıc', lessons: 42, rating: 4.9, students: 12450, price: 'Pulsuz', color: '#3B82F6' },
  { id: 2, emoji: '🤖', title: 'Maşın Öyrənməsi',           subtitle: 'TensorFlow, Scikit-learn ilə',  cat: 'Proqramlaşdırma', level: 'Qabaqcıl', lessons: 58, rating: 4.9, students: 5640,  price: '49₼',   color: '#8B5CF6' },
  { id: 3, emoji: '🌍', title: 'İngilis Dili A1-B2',         subtitle: 'Danışıq, yazı, qrammatika',    cat: 'Dillər',         level: 'Başlanğıc', lessons: 90, rating: 4.9, students: 25600, price: 'Pulsuz', color: '#F97316' },
]

const FLOATS = [
  { emoji: '🐍', title: 'Python Kursu',       meta: '12,450 şagird',      style: { top: 40,  left: -10 }, delay: 0,    glow: 'rgba(59,130,246,.35)' },
  { emoji: '🔥', title: '23 günlük seriya',   meta: 'Davam edir! 🎉',     style: { top: 55,  right: -20 }, delay: -1.6, glow: 'rgba(249,115,22,.35)' },
  { emoji: '⚡', title: '+150 XP Qazanıldı',  meta: 'Dərs tamamlandı',    style: { bottom: 130, left: -30 }, delay: -2.9, glow: 'rgba(139,92,246,.35)' },
  { emoji: '🤖', title: 'Maşın Öyrənməsi',    meta: 'Qabaqcıl · 58 dərs', style: { bottom: 100, right: -15 }, delay: -0.9, glow: 'rgba(236,72,153,.35)' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const dur = 2200, t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - t0) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setN(Math.floor(ease * target))
          if (p < 1) requestAnimationFrame(tick); else setN(target)
        }
        requestAnimationFrame(tick)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{n.toLocaleString('en-US')}{suffix}</span>
}

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px',
      background: scrolled ? 'rgba(6,11,24,.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : 'none',
      transition: 'all .3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: T.grad, overflow: 'hidden', boxShadow: '0 0 20px rgba(99,102,241,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WolfMascot width={55} height={55} style={{ objectFit: 'cover', marginTop: '30%' }} />
        </div>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AzLearn</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {(['Ana Səhifə', 'Kurslar'] as const).map((l, i) => (
          <Link key={l} href={i === 1 ? '/courses' : '/'} style={{
            background: 'transparent', color: T.muted,
            border: '1px solid transparent', borderRadius: 10,
            padding: '7px 15px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            transition: `all .2s ${T.spring}`,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.text; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >{l}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link href="/login" style={{ background: 'transparent', color: T.muted, border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '7px 16px', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'all .2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.text }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted }}
        >Giriş</Link>
        <Link href="/register" style={{ background: T.grad, color: '#fff', border: 'none', borderRadius: 10, padding: '7px 18px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 18px rgba(99,102,241,.4)', transition: 'all .2s' }}>
          Başla →
        </Link>
      </div>
    </nav>
  )
}

export default function LandingPage() {
  const stats = [
    { val: 50000, suf: '+', label: 'Şagird' },
    { val: 200,   suf: '+', label: 'Kurs' },
    { val: 98,    suf: '%', label: 'Məmnuniyyət' },
    { val: 24,    suf: '',  label: 'Müəllim' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'inherit' }}>
      <LandingNav />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '80px 64px 60px' }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.28) 0%,transparent 70%)', top: -200, left: -160, animation: 'orb-a 11s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,.22) 0%,transparent 70%)', bottom: -120, right: '8%', animation: 'orb-b 13s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)', top: '38%', left: '38%', animation: 'orb-c 9s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>

        {/* Left copy */}
        <div style={{ flex: '0 0 52%', maxWidth: 600, position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,.14)', border: '1px solid rgba(99,102,241,.3)', borderRadius: 100, padding: '6px 18px', marginBottom: 28, fontSize: 13, fontWeight: 700, color: '#A5B4FC' }}>
            <span style={{ fontSize: 16 }}>🐺</span> Azərbaycanın №1 e-öyrənmə platforması
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            style={{ fontSize: 74, fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.045em', marginBottom: 22 }}>
            Bilikli ol.<br />
            <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Güclü ol.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
            style={{ fontSize: 19, color: T.muted, lineHeight: 1.65, marginBottom: 38, maxWidth: 440 }}>
            Azərbaycan dilində proqramlaşdırma, dizayn və texnologiya — gamification ilə sürətlə inkişaf et.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}
            style={{ display: 'flex', gap: 14, marginBottom: 52, flexWrap: 'wrap' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.grad, color: '#fff', border: 'none', borderRadius: 16, padding: '17px 40px', fontSize: 19, fontWeight: 900, textDecoration: 'none', boxShadow: '0 0 32px rgba(99,102,241,.6)', transition: `all .18s ${T.spring}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >🚀 Pulsuz Başla</Link>
            <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', color: T.text, border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: '17px 40px', fontSize: 19, fontWeight: 900, textDecoration: 'none', backdropFilter: 'blur(14px)', transition: `all .18s ${T.spring}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >▶ Kurslara Bax</Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '12px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.text, lineHeight: 1 }}>
                  <AnimatedCounter target={s.val} suffix={s.suf} />
                </div>
                <div style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: mascot */}
        <div style={{ flex: 1, position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.28) 0%,transparent 70%)', animation: 'pulse-ring 3.2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1.5px solid rgba(99,102,241,.18)', animation: 'spin-slow 22s linear infinite' }} />
          <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', border: '1px dashed rgba(99,102,241,.08)', animation: 'spin-slow 35s linear infinite reverse' }} />

          <WolfMascot width={270} height={270}
            style={{ objectFit: 'contain', position: 'relative', zIndex: 5, animation: 'float-alt 5s ease-in-out infinite', filter: 'drop-shadow(0 24px 56px rgba(99,102,241,.65))' }} />

          {FLOATS.map((f, i) => (
            <div key={i} style={{
              position: 'absolute', background: 'rgba(10,18,40,0.88)', backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16,
              padding: '11px 15px', display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: `0 10px 36px rgba(0,0,0,.45), 0 0 22px ${f.glow}`,
              animation: 'float 4s ease-in-out infinite', animationDelay: `${f.delay}s`,
              zIndex: 10, minWidth: 150, ...f.style,
            }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{f.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text, whiteSpace: 'nowrap' }}>{f.title}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{f.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section style={{ padding: '88px 64px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(6,182,212,.18)', color: '#67E8F9', border: '1px solid rgba(6,182,212,.3)', marginBottom: 14 }}>Populyar Kurslar</span>
          <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12 }}>Ən çox seçilən kurslar</h2>
          <p style={{ fontSize: 17, color: T.muted }}>Minlərlə şagird bu kurslarla karyerasını dəyişdi</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {FEATURED.map(c => <FeaturedCourseCard key={c.id} course={c} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', color: T.text, border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: '13px 30px', fontSize: 17, fontWeight: 700, textDecoration: 'none', backdropFilter: 'blur(14px)', transition: `all .22s ${T.spring}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >Bütün Kurslara Bax →</Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '88px 64px', background: 'rgba(255,255,255,.018)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,.18)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,.3)', marginBottom: 14 }}>Sadədir!</span>
          <h2 style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-0.04em' }}>Necə işləyir?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, maxWidth: 940, margin: '0 auto' }}>
          {[
            { step: '01', emoji: '🎯', title: 'Kurs seç', desc: '200+ kurs arasından özünə uyğun olanı seç — pulsuz başla, istənilən vaxt tərk et' },
            { step: '02', emoji: '📚', title: 'Öyrən, xal qazanın', desc: 'Hər dərsi tamamla, XP qazanın, səviyyəni artır — gamification sürəti artırır' },
            { step: '03', emoji: '🏆', title: 'Sertifikat al', desc: 'Kursu tamamla, peşəkar sertifikat əldə et, karyeranı irəlilət' },
          ].map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: T.card, backdropFilter: 'blur(18px)', border: `1px solid ${T.border}`, borderRadius: 26, padding: 36, textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 13, fontWeight: 900, color: 'rgba(99,102,241,.25)', letterSpacing: '-0.02em' }}>{s.step}</div>
              <div style={{ fontSize: 54, marginBottom: 20 }}>{s.emoji}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.65 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '88px 64px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.18) 0%,rgba(6,182,212,.12) 100%)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 36, padding: '72px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.14) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <WolfMascot width={84} height={84} style={{ objectFit: 'contain', marginBottom: 22, filter: 'drop-shadow(0 10px 28px rgba(99,102,241,.55))', animation: 'float-alt 4s ease-in-out infinite' }} />
          <h2 style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-0.045em', marginBottom: 14 }}>
            Hazırsan,{' '}
            <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>dostum?</span>
          </h2>
          <p style={{ fontSize: 19, color: T.muted, marginBottom: 38 }}>Qeydiyyat pulsuz. Birinci dərs bu gün.</p>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.grad, color: '#fff', borderRadius: 16, padding: '17px 40px', fontSize: 19, fontWeight: 900, textDecoration: 'none', boxShadow: '0 0 32px rgba(99,102,241,.6)' }}>
            🚀 İndi Başla — Pulsuz
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

function FeaturedCourseCard({ course }: { course: typeof FEATURED[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href="/courses" style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? T.cardHov : T.card, backdropFilter: 'blur(20px)',
          border: `1px solid ${hov ? T.borderHov : T.border}`, borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
          transition: `all .32s ${T.spring}`, transform: hov ? 'translateY(-7px) scale(1.018)' : 'none',
          boxShadow: hov ? `0 28px 52px rgba(0,0,0,.5),0 0 38px ${course.color}28` : 'none',
        }}>
        <div style={{ height: 112, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg,${course.color}38 0%,${course.color}14 100%)`, borderBottom: `1px solid ${course.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 46, filter: `drop-shadow(0 5px 14px ${course.color}90)`, transition: `transform .32s ${T.spring}`, transform: hov ? 'scale(1.22) rotate(8deg)' : 'scale(1)', display: 'block' }}>{course.emoji}</span>
          {course.price === 'Pulsuz' && (
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(34,197,94,.2)', color: '#4ADE80', border: '1px solid rgba(34,197,94,.3)', borderRadius: 8, padding: '3px 9px', fontSize: 11, fontWeight: 800 }}>PULSUZ</div>
          )}
        </div>
        <div style={{ padding: '16px 18px 20px' }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,.18)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,.3)' }}>{course.cat}</span>
            <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 7, fontSize: 12, fontWeight: 700, background: 'rgba(34,197,94,.18)', color: '#86EFAC', border: '1px solid rgba(34,197,94,.3)' }}>{course.level}</span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 3, lineHeight: 1.35, color: T.text }}>{course.title}</h3>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 12, lineHeight: 1.4 }}>{course.subtitle}</p>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: T.dim, marginBottom: 12, flexWrap: 'wrap' }}>
            <span>📚 {course.lessons} dərs</span>
            <span>⭐ {course.rating}</span>
            <span>👥 {course.students.toLocaleString('en-US')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: course.price === 'Pulsuz' ? '#4ADE80' : T.text }}>{course.price}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
