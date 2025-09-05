export function fireConfetti() {
  const c = document.createElement("canvas")
  const ctx = c.getContext("2d")!
  c.style.position = "fixed"
  c.style.inset = "0"
  c.style.pointerEvents = "none"
  c.width = innerWidth
  c.height = innerHeight
  document.body.appendChild(c)

  const N = 140
  const parts = Array.from({ length: N }).map(() => ({
    x: Math.random() * c.width,
    y: -20,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 3 + 2,
    size: Math.random() * 6 + 4,
    hue: 200 + Math.random() * 140,
    life: 0,
  }))

  let tId: number
  const draw = () => {
    ctx.clearRect(0, 0, c.width, c.height)
    parts.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.04
      p.life += 1
      ctx.fillStyle = `hsl(${p.hue}, 95%, 65%)`
      ctx.fillRect(p.x, p.y, p.size, p.size * 0.6)
    })
    if (parts.every((p) => p.y > c.height || p.life > 300)) {
      cancelAnimationFrame(tId)
      c.remove()
      return
    }
    tId = requestAnimationFrame(draw)
  }
  draw()
}
