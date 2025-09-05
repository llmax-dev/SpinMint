"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { vinylVariants } from "@/lib/animations"

interface CDSpinnerProps {
  profileImageUrl: string
  size?: number
  isSpinning?: boolean
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
  className?: string
}

export default function CDSpinner({
  profileImageUrl,
  size = 300,
  isSpinning = true,
  onCanvasReady,
  className = "",
}: CDSpinnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Draw the vinyl record with profile image
  const drawVinylRecord = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, currentRotation: number) => {
      const centerX = size / 2
      const centerY = size / 2
      const radius = size / 2 - 10
      const holeRadius = size * 0.075 // 7.5% of size for center hole

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Save context for transformations
      ctx.save()

      // Create circular clipping path for the record
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.clip()

      // Draw vinyl record background with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, "#2a2a2a")
      gradient.addColorStop(0.3, "#1a1a1a")
      gradient.addColorStop(0.7, "#2a2a2a")
      gradient.addColorStop(1, "#0a0a0a")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw vinyl rings (grooves)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
      ctx.lineWidth = 1
      for (let i = holeRadius + 20; i < radius; i += 8) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, i, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Rotate context for spinning effect
      if (isSpinning) {
        ctx.translate(centerX, centerY)
        ctx.rotate((currentRotation * Math.PI) / 180)
        ctx.translate(-centerX, -centerY)
      }

      // Draw profile image as record texture
      if (img.complete && img.naturalHeight !== 0) {
        const imgSize = radius * 1.6 // Make image slightly larger than record
        const imgX = centerX - imgSize / 2
        const imgY = centerY - imgSize / 2

        // Create circular clipping path for image
        ctx.save()
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2)
        ctx.clip()

        // Draw image with slight opacity to blend with vinyl
        ctx.globalAlpha = 0.8
        ctx.drawImage(img, imgX, imgY, imgSize, imgSize)
        ctx.globalAlpha = 1
        ctx.restore()
      }

      // Restore context
      ctx.restore()

      // Draw specular highlight (always on top, not rotating)
      const highlightGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.6,
      )
      highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)")
      highlightGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.2)")
      highlightGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.05)")
      highlightGradient.addColorStop(1, "transparent")

      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw center hole
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw center hole highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Draw center hub
      const hubRadius = holeRadius * 0.6
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, hubRadius)
      hubGradient.addColorStop(0, "#444")
      hubGradient.addColorStop(1, "#222")

      ctx.fillStyle = hubGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, hubRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw outer ring/edge
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2)
      ctx.stroke()
    },
    [size, isSpinning],
  )

  // Animation loop
  const animate = useCallback(() => {
    if (!isSpinning) return

    setRotation((prev) => (prev + 0.5) % 360) // Slow rotation
    animationRef.current = requestAnimationFrame(animate)
  }, [isSpinning])

  // Initialize canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size

    // Load profile image
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      setImageLoaded(true)
      drawVinylRecord(ctx, img, rotation)

      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas)
      }
    }

    img.onerror = () => {
      console.error("Failed to load profile image")
      // Draw without image
      drawVinylRecord(ctx, img, rotation)
      if (onCanvasReady) {
        onCanvasReady(canvas)
      }
    }

    img.src = profileImageUrl
  }, [profileImageUrl, size, onCanvasReady, drawVinylRecord, rotation])

  // Redraw when rotation changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => drawVinylRecord(ctx, img, rotation)
    img.src = profileImageUrl
  }, [rotation, imageLoaded, profileImageUrl, drawVinylRecord])

  // Start/stop animation
  useEffect(() => {
    if (isSpinning) {
      animate()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpinning, animate])

  return (
    <motion.div
      className={`relative ${className}`}
      variants={vinylVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      style={{
        width: size,
        height: size,
      }}
    >
      <canvas
        ref={canvasRef}
        className="rounded-full shadow-2xl"
        style={{
          width: size,
          height: size,
          filter: "drop-shadow(0 8px 32px rgba(139, 92, 246, 0.3))",
        }}
      />

      {/* Loading overlay */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full backdrop-blur-sm">
          <div className="loading-spinner w-8 h-8" />
        </div>
      )}

      {/* Spinning indicator */}
      {isSpinning && imageLoaded && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg" />
      )}
    </motion.div>
  )
}
