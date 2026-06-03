'use client'

import { useState } from 'react'

interface Props {
  width?: number
  height?: number
  style?: React.CSSProperties
  className?: string
  alt?: string
}

export default function WolfMascot({ width = 80, height = 80, style, className, alt = 'AzLearn Wolf' }: Props) {
  const [err, setErr] = useState(false)

  if (err) {
    return (
      <div className={className} style={{
        width, height, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.min(width, height) * 0.6, lineHeight: 1,
        ...style,
      }}>
        🐺
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/wolf.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setErr(true)}
    />
  )
}
