"use client"

import Image from "next/image"
import type React from "react"
import { forwardRef, useEffect, useRef, useState } from "react"

type Props = {
  src: string
  size?: { mobileMax?: number; desktopMax?: number } // px
  boostKey?: number // 成功時の瞬間加速トリガ
}

/**
 * 仕組み：
 * - 外側リング(常時CSSアニメ) + 内側リング(ユーザードラッグのオフセット)
 *   → "常時回り続ける" + "指で回せる"が両立。停止やカクつきを回避
 * - クリック/ドラッグ時の青い枠や太いリングは完全無効化
 */
const SpinDisc = forwardRef<HTMLDivElement, Props>(function SpinDisc(
  { src, size = { mobileMax: 320, desktopMax: 360 }, boostKey },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [offsetDeg, setOffsetDeg] = useState(0)

  // 成功時の瞬間加速（~1.2秒）
  useEffect(() => {
    if (!wrapperRef.current) return
    const el = wrapperRef.current
    el.style.setProperty("--spin-dur", "1.4s")
    const t = setTimeout(() => el.style.setProperty("--spin-dur", "4s"), 1200)
    return () => clearTimeout(t)
  }, [boostKey])

  // DJドラッグ
  useEffect(() => {
    const target = innerRef.current
    if (!target) return
    let dragging = false
    let lastAng = 0

    const center = () => {
      const r = target.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    const getAng = (x: number, y: number) => {
      const c = center()
      return (Math.atan2(y - c.y, x - c.x) * 180) / Math.PI
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      target.setPointerCapture(e.pointerId)
      lastAng = getAng(e.clientX, e.clientY)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const ang = getAng(e.clientX, e.clientY)
      setOffsetDeg((deg) => (deg + (ang - lastAng)) % 360)
      lastAng = ang
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {}
    }

    target.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    window.addEventListener("pointercancel", onUp, { passive: true })

    return () => {
      target.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [])

  const mobileMax = size.mobileMax ?? 320
  const desktopMax = size.desktopMax ?? 360

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node
        if (typeof ref === "function") ref(node!)
        else if (ref) (ref as any).current = node
      }}
      className="spin-wrapper select-none"
      style={
        {
          "--spin-dur": "4s",
          "--disc-size-mobile": `${mobileMax}px`,
          "--disc-size-desktop": `${desktopMax}px`,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div ref={innerRef} className="spin-offset" style={{ transform: `rotate(${offsetDeg}deg)` }}>
        <div className="disc">
          <Image
            src={src || "/placeholder.svg"}
            alt="record"
            width={desktopMax}
            height={desktopMax}
            priority
            draggable={false}
            className="disc-img"
          />
          <div className="disc-gloss" />
          <div className="disc-center" />
        </div>
      </div>
    </div>
  )
})

export default SpinDisc
