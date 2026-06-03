export const T = {
  bg: '#060B18',
  card: 'rgba(255,255,255,0.055)',
  cardHov: 'rgba(255,255,255,0.095)',
  border: 'rgba(255,255,255,0.09)',
  borderHov: 'rgba(255,255,255,0.18)',
  purple: '#6366F1',
  purpleL: '#818CF8',
  cyan: '#06B6D4',
  green: '#22C55E',
  orange: '#F97316',
  yellow: '#EAB308',
  red: '#EF4444',
  text: '#F1F5F9',
  muted: '#94A3B8',
  dim: '#475569',
  grad: 'linear-gradient(135deg,#6366F1 0%,#06B6D4 100%)',
  gradG: 'linear-gradient(135deg,#22C55E 0%,#16A34A 100%)',
  spring: 'cubic-bezier(0.34,1.56,0.64,1)',
  ease: 'cubic-bezier(0.4,0,0.2,1)',
} as const

export function triggerConfetti() {
  if (typeof window === 'undefined') return
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.display = 'block'
  const cols = ['#6366F1','#06B6D4','#22C55E','#F59E0B','#EC4899','#A855F7','#F97316']
  const ps = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width, y: -20,
    vx: (Math.random() - .5) * 10, vy: Math.random() * 7 + 2,
    size: Math.random() * 10 + 4, color: cols[Math.floor(Math.random() * cols.length)],
    rot: Math.random() * 360, rotV: (Math.random() - .5) * 14,
    alpha: 1, shape: Math.random() > .45 ? 'rect' : 'circle' as 'rect' | 'circle'
  }))
  let frame = 0
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ps.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.13; p.rot += p.rotV
      if (frame > 65) p.alpha -= 0.016
      if (p.alpha <= 0) return
      ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha)
      ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180)
      ctx.fillStyle = p.color
      if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill() }
      else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      ctx.restore()
    })
    frame++
    if (frame < 170 && ps.some((p) => p.alpha > 0)) requestAnimationFrame(draw)
    else canvas.style.display = 'none'
  }
  requestAnimationFrame(draw)
}
