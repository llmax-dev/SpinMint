"use client"

import { useEffect, useMemo } from "react"

const COUNT = 40

export default function Confetti() {
  const pieces = useMemo(() => Array.from({ length: COUNT }, (_, i) => i), [])

  useEffect(() => {
    // 自動消滅は親側で制御済み
  }, [])

  return (
    <div className="confetti-wrap" aria-hidden>
      {pieces.map((i) => (
        <span
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.15}s`,
            animationDuration: `${0.8 + Math.random() * 0.4}s`,
            background: `hsl(${200 + Math.random() * 80}, ${60 + Math.random() * 30}%, ${55 + Math.random() * 15}%)`,
          }}
          key={i}
        />
      ))}
    </div>
  )
}
