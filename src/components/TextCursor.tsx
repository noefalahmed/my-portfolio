"use client"

import { useEffect, useRef, useState } from 'react'
import styles from './TextCursor.module.css'

function hasLargeTextAncestor(el: Element | null): boolean {
  let node = el
  while (node && node !== document.body) {
    if (Array.from(node.classList).some(c => c.includes('largetext'))) return true
    node = node.parentElement
  }
  return false
}

function isOverText(el: Element | null): boolean {
  if (!el || el === document.body) return false
  if (el.closest('a, button, input, textarea, select')) return false
  return !!el.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote') || hasLargeTextAncestor(el)
}

export default function TextCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.left = `${e.clientX}px`
      cursorRef.current.style.top  = `${e.clientY}px`
    }

    const onOver = (e: MouseEvent) => {
      const overText = isOverText(e.target as Element)
      setVisible(overText)
      window.dispatchEvent(new CustomEvent('textcursor', { detail: { active: overText } }))
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      style={{ opacity: visible ? 1 : 0 }}
    />
  )
}
