"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { celebrationVariants } from "@/lib/animations"

interface ConfettiOrPlaneProps {
  type?: "confetti" | "plane"
  isVisible: boolean
  onComplete?: () => void
}

export default function ConfettiOrPlane({ type = "confetti", isVisible, onComplete }: ConfettiOrPlaneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<any[]>([])

  useEffect(() => {
    if (!isVisible || type !== "confetti") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create particles
    const colors = ["#8b5cf6", "#a855f7", "#7c3aed", "#6366f1", "#3b82f6"]
    const particles: any[] = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.1,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
      })
    }

    particlesRef.current = particles

    const startTime = Date.now()
    const duration = 1200 // 1.2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update physics
        particle.vy += particle.gravity
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed
        particle.life -= particle.decay

        // Draw particle
        if (particle.life > 0) {
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.rotation)
          ctx.globalAlpha = particle.life
          ctx.fillStyle = particle.color

          // Draw as small rectangle (confetti piece)
          ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2)

          ctx.restore()
        }

        // Remove dead particles
        if (particle.life <= 0 || particle.y > canvas.height + 50) {
          particles.splice(index, 1)
        }
      })

      if (progress < 1 && particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        if (onComplete) {
          setTimeout(onComplete, 300)
        }
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, type, onComplete])

  if (type === "plane") {
    return (
      <motion.div
        className="fixed top-1/2 left-1/2 z-50 pointer-events-none"
        variants={celebrationVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="exit"
        onAnimationComplete={() => {
          if (isVisible && onComplete) {
            setTimeout(onComplete, 800)
          }
        }}
      >
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          animate={{
            x: [0, 200, 400],
            y: [0, -50, -100],
            rotate: [0, 15, 30],
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        >
          <path d="M3 2v6h16l4-3-4-3z" />
          <path d="M21 6v4l-3 3H9l-4-7 4-1z" />
        </motion.svg>
      </motion.div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-50 pointer-events-none ${isVisible ? "block" : "hidden"}`}
      style={{ background: "transparent" }}
    />
  )
}
