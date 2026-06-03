'use client'

import { useEffect, useState } from 'react'

interface Props {
  value: number
  max?: number
  size?: number
  stroke?: number
  color?: string
  label?: string
  sublabel?: string
}

export default function ProgressRing({ value, max = 100, size = 88, stroke = 9, color = '#6366F1', label, sublabel }: Props) {
  const [prog, setProg] = useState(0)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max * 100, 100)

  useEffect(() => {
    const t = setTimeout(() => setProg(pct), 160)
    return () => clearTimeout(t)
  }, [pct])

  const offset = circ - prog / 100 * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.1,0.64,1)', filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        {label && <div style={{ fontSize: size * .22, fontWeight: 900, color: '#F1F5F9', lineHeight: 1 }}>{label}</div>}
        {sublabel && <div style={{ fontSize: size * .14, color: '#94A3B8', lineHeight: 1.3, marginTop: 2 }}>{sublabel}</div>}
      </div>
    </div>
  )
}
