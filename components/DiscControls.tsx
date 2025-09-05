"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  selector?: string
  boostWhenMint?: boolean
}

export default function DiscControls({ selector = "#disc", boostWhenMint = false }: Props) {
  const baseRef = useRef(0)
  const [playing, setPlaying] = useState(true)
  const [speedSec, setSpeedSec] = useState(4)
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef(0) // Added smooth interpolation for drag

  const getEl = () => document.querySelector<HTMLElement>(selector)

  useEffect(() => {
    const el = getEl()
    if (!el) return
    el.style.setProperty("--disc-state", playing ? "running" : "paused")
    el.style.setProperty("--disc-speed", `${speedSec}s`)
  }, [playing, speedSec])

  useEffect(() => {
    if (!boostWhenMint) return
    const prev = speedSec
    setSpeedSec(Math.max(0.75, prev * 0.45))
    const t = setTimeout(() => setSpeedSec(prev), 1500)
    return () => clearTimeout(t)
  }, [boostWhenMint])

  useEffect(() => {
    const el = getEl()
    if (!el) return

    let dragging = false
    let lastAngle = 0

    const center = () => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    const angleAt = (x: number, y: number) => {
      const c = center()
      return (Math.atan2(y - c.y, x - c.x) * 180) / Math.PI
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      el.setPointerCapture?.(e.pointerId)
      setPlaying(false)
      lastAngle = angleAt(e.clientX, e.clientY)
      el.classList.add("grabbing")
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const a = angleAt(e.clientX, e.clientY)
      const delta = a - lastAngle
      lastAngle = a
      pendingRef.current += delta // 一旦ためる
      tick() // 反映ドライブ
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      try {
        el.releasePointerCapture?.(e.pointerId)
      } catch {}
      setPlaying(true)
      el.classList.remove("grabbing")
    }

    const tick = () => {
      if (rafRef.current) return
      const loop = () => {
        // 角度差をイージングで消費
        const add = pendingRef.current * 0.8
        pendingRef.current -= add
        baseRef.current = (baseRef.current + add) % 360
        el.style.setProperty("--disc-base", `${baseRef.current}deg`)
        el.style.transform = `rotate(${baseRef.current}deg)`
        if (Math.abs(pendingRef.current) > 0.05) {
          rafRef.current = requestAnimationFrame(loop)
        } else {
          rafRef.current = null
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    el.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)

    return () => {
      el.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return null
}
