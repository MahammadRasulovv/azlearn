import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AzLearn — Azərbaycanca Proqramlaşdırma',
  description: 'Azərbaycan dilində proqramlaşdırma öyrən',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full" style={{ background: '#060B18', color: '#F1F5F9' }}>
        <canvas id="confetti-canvas" style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', display: 'none' }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
