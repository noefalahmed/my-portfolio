import { useEffect, useRef } from 'react'

const STAR_COUNT = 40

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number

    // Generate stars once
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }))

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function draw(t: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of stars) {
        const twinkle = star.opacity + Math.sin(t * star.speed + star.phase) * 0.2
        const alpha = Math.max(0.05, Math.min(1, twinkle))

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(
          star.x * canvas.width,
          star.y * canvas.height,
          2,
          2
        )
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'starsFadeIn 1.5s ease both 2.3s',
      }}
    />
  )
}
