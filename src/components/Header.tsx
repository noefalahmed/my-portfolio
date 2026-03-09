"use client"

import React, { useState, useEffect, useRef } from "react"
import styles from "./Header.module.css"

interface DetailItem {
  label: string
  value: string
}

interface HeaderProps {
  title: string
  imageSrc: string
  imageAlt: string
  details: DetailItem[]
}

const Header: React.FC<HeaderProps> = ({ title, imageSrc, imageAlt, details }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [typedTitle, setTypedTitle] = useState("")

  const titleWords = title.trim().split(' ')
  const titlePrefix = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') + ' ' : ''
  const titleSuffix = titleWords.length > 1 ? titleWords[titleWords.length - 1] : title

  useEffect(() => {
    const PIXEL_SIZE = 32       // larger pixel blocks
    const LERP = 0.04           // how fast each pixel transitions toward its target (per frame)
    const CHANGE_MIN = 150      // ms minimum before a pixel picks a new target
    const CHANGE_MAX = 600      // ms maximum
    const NOISE_DURATION = 700  // ms of noise phase
    const FADE_DURATION = 500   // ms of fade-out phase

    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    const img = imgRef.current
    if (!canvas || !wrapper || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let timeout: ReturnType<typeof setTimeout>

    const startAnimation = () => {
      requestAnimationFrame(() => {
        const dpr = window.devicePixelRatio || 1
        const cssW = wrapper.offsetWidth
        const cssH = wrapper.offsetHeight
        if (cssW === 0 || cssH === 0) return

        canvas.width = cssW * dpr
        canvas.height = cssH * dpr
        canvas.style.width = cssW + 'px'
        canvas.style.height = cssH + 'px'
        canvas.style.opacity = '1'
        canvas.style.display = 'block'
        ctx.scale(dpr, dpr)

        const w = cssW
        const h = cssH
        const cols = Math.ceil(w / PIXEL_SIZE)
        const rows = Math.ceil(h / PIXEL_SIZE)

        // t=0 → #080B0F (dark), t=1 → #272727 (light)
        // brightness scale 0–100: <10 = transparent, 10–100 = lerp between colors
        const pickTarget = () => {
          const r = Math.random()
          if (r < 0.45) return Math.random() * 8          // transparent
          if (r < 0.78) return 12 + Math.random() * 8    // dark (#080B0F)
          return 88 + Math.random() * 12                  // light (#272727)
        }

        type Cell = { brightness: number; target: number; nextChange: number }
        const grid: Cell[][] = Array.from({ length: cols }, () =>
          Array.from({ length: rows }, () => ({
            brightness: Math.random() * 8,
            target: pickTarget(),
            nextChange: Math.random() * CHANGE_MAX,
          }))
        )

        // Cover image immediately
        ctx.fillStyle = '#030708'
        ctx.fillRect(0, 0, w, h)

        let startTime: number | null = null

        const draw = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const elapsed = timestamp - startTime

          if (elapsed < NOISE_DURATION) {
            ctx.fillStyle = '#030708'
            ctx.fillRect(0, 0, w, h)

            for (let col = 0; col < cols; col++) {
              for (let row = 0; row < rows; row++) {
                const cell = grid[col][row]

                // Assign new target when scheduled
                if (timestamp > cell.nextChange) {
                  cell.target = pickTarget()
                  cell.nextChange = timestamp + CHANGE_MIN + Math.random() * (CHANGE_MAX - CHANGE_MIN)
                }

                // Smoothly interpolate brightness toward target
                cell.brightness += (cell.target - cell.brightness) * LERP

                const v = cell.brightness
                if (v < 10) continue  // transparent — dark bg shows through
                // lerp: t=0 → #080B0F (8,11,15), t=1 → #272727 (39,39,39)
                const t = Math.min(1, (v - 10) / 90)
                const r = Math.round(8 + t * 31)
                const g = Math.round(11 + t * 28)
                const b = Math.round(15 + t * 24)
                ctx.fillStyle = `rgb(${r},${g},${b})`
                ctx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
              }
            }
            rafId = requestAnimationFrame(draw)
          } else {
            // Smooth fade out
            const t = Math.min((elapsed - NOISE_DURATION) / FADE_DURATION, 1)
            const eased = t * t * (3 - 2 * t) // smoothstep: slow start, slow end
            canvas.style.opacity = String(1 - eased)
            if (t < 1) {
              rafId = requestAnimationFrame(draw)
            } else {
              canvas.style.display = 'none'
            }
          }
        }

        timeout = setTimeout(() => {
          rafId = requestAnimationFrame(draw)
        }, 350)
      })
    }

    if (img.complete) {
      startAnimation()
    } else {
      img.addEventListener('load', startAnimation, { once: true })
    }

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId)
      img.removeEventListener('load', startAnimation)
    }
  }, [])

  useEffect(() => {
    const speed = 45

    // Type only the last two words of the title
    let i = 0
    const titleInterval = setInterval(() => {
      i++
      setTypedTitle(titleSuffix.slice(0, i))
      if (i >= titleSuffix.length) clearInterval(titleInterval)
    }, speed)

    return () => {
      clearInterval(titleInterval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.headerContainer}>
      <div ref={wrapperRef} className={styles.imageWrapper}>
        <img ref={imgRef} src={imageSrc || "/proj2.png"} alt={imageAlt} className={styles.headerImage} />
        <canvas ref={canvasRef} className={styles.canvasOverlay} />
      </div>
      <h1 className={styles.headerTitle}>
        {titlePrefix}<span className={styles.typedSuffix}>{typedTitle}</span><span style={{ opacity: 0 }}>{titleSuffix.slice(typedTitle.length)}</span>
      </h1>
      <div className={styles.detailsRow}>
        {details.map((detail, index) => (
          <div key={index} className={styles.detailPair}>
            <span className={styles.detailLabel}>{detail.label}</span>
            <span className={styles.detailValue}>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Header
