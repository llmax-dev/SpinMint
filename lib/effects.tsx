// lib/effects.ts
export function fireConfetti() {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  canvas.style.position = "fixed"
  canvas.style.inset = "0"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "9999"
  document.body.appendChild(canvas)

  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const resize = () => {
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
  }
  resize()
  window.addEventListener("resize", resize)

  const particles = Array.from({ length: 140 }).map(() => ({
    x: Math.random() * canvas.width,
    y: -20 * dpr,
    vx: (Math.random() - 0.5) * 3 * dpr,
    vy: (2 + Math.random() * 3) * dpr,
    size: (4 + Math.random() * 6) * dpr,
    color: `hsl(${Math.random() * 360}, 90%, 60%)`,
    life: 0,
  }))

  let t = 0
  const maxT = 90 // ~1.5s
  const raf = () => {
    t++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.05 * dpr
      p.life += 1
      ctx.fillStyle = p.color
      ctx.fillRect(p.x, p.y, p.size, p.size)
    })
    if (t < maxT) requestAnimationFrame(raf)
    else {
      window.removeEventListener("resize", resize)
      canvas.remove()
    }
  }
  requestAnimationFrame(raf)
}

let styleInjected = false
export function flyPaperPlane() {
  if (!styleInjected) {
    const style = document.createElement("style")
    style.textContent = `
    @keyframes planeFly {
      0% { transform: translate(80vw, 70vh) rotate(12deg); opacity: 0 }
      10%{ opacity: 1 }
      100%{ transform: translate(-20vw, 10vh) rotate(-8deg); opacity: 0.8 }
    }`
    document.head.appendChild(style)
    styleInjected = true
  }
  const el = document.createElement("div")
  el.innerHTML = `
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="url(#g)" stroke="white" stroke-width="1"/>
      <defs>
        <linearGradient id="g" x1="22" y1="2" x2="2" y2="22">
          <stop stop-color="#A78BFA"/>
          <stop offset="1" stop-color="#60A5FA"/>
        </linearGradient>
      </defs>
    </svg>`
  const plane = el.firstElementChild as SVGElement
  plane.style.position = "fixed"
  plane.style.left = "0"
  plane.style.top = "0"
  plane.style.zIndex = "9999"
  ;(plane.style as any).animation = "planeFly 1.8s ease-out forwards"
  document.body.appendChild(plane)
  setTimeout(() => plane.remove(), 2000)
}
