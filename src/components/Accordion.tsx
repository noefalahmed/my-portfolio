"use client"

import React, { useState, useRef, useEffect } from "react"
import styles from "./Accordion.module.css"
import { ChevronDown } from "lucide-react"

interface AccordionItem {
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

const HEADER_HEIGHT = 57

// Handles only the animated content area
const AccordionContent = React.forwardRef<HTMLDivElement, { content: React.ReactNode; isOpen: boolean }>(
  ({ content, isOpen }, outerRef) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  React.useImperativeHandle(outerRef, () => wrapperRef.current as HTMLDivElement)
  const [height, setHeight] = useState<number | 'auto'>(0)
  const [overflow, setOverflow] = useState<'hidden' | 'visible'>('hidden')
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!contentRef.current) return

    if (isOpen) {
      setOverflow('hidden')
      setHeight(contentRef.current.scrollHeight)
      const t = setTimeout(() => setOpacity(1), 50)
      return () => clearTimeout(t)
    } else {
      setOpacity(0)
      setOverflow('hidden')
      if (wrapperRef.current) {
        const currentHeight = wrapperRef.current.getBoundingClientRect().height
        setHeight(currentHeight)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setHeight(0))
        })
      } else {
        setHeight(0)
      }
    }
  }, [isOpen])

  const handleTransitionEnd = () => {
    if (isOpen) {
      setHeight('auto')
      setOverflow('visible')
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.accordionContent}
      style={{ height: height === 'auto' ? 'auto' : `${height}px`, overflow }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={contentRef}
        className={styles.accordionContentInner}
        style={{ opacity, transition: 'opacity 0.4s ease' }}
      >
        {content}
      </div>
    </div>
  )
})

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [navbarBottom, setNavbarBottom] = useState(0)
  const [hidden, setHidden] = useState(false)
  const headerRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastScrollY = useRef(0)

  function getScrollParent(el: HTMLElement): HTMLElement | Window {
    let parent: HTMLElement | null = el.parentElement
    while (parent) {
      const style = getComputedStyle(parent)
      if (/scroll|auto/.test(style.overflow + style.overflowY)) return parent
      parent = parent.parentElement
    }
    return window
  }

  useEffect(() => {
    const THRESHOLD = 4
    const update = (e?: Event) => {
      const navbar = document.querySelector('nav')
      const bottom = navbar ? Math.max(0, navbar.getBoundingClientRect().bottom) : 0
      setNavbarBottom(bottom)

      const target = e?.target as Element | null
      const y = (target && 'scrollTop' in target) ? (target as Element).scrollTop : window.scrollY
      const delta = y - lastScrollY.current
      if (delta > THRESHOLD) setHidden(true)
      else if (delta < -THRESHOLD) setHidden(false)
      lastScrollY.current = y
    }
    update()
    document.addEventListener('scroll', update, { passive: true, capture: true })
    return () => document.removeEventListener('scroll', update, { capture: true })
  }, [])

  const toggle = (index: number) => {
    const isOpening = openIndex !== index
    setOpenIndex(openIndex === index ? null : index)

    if (isOpening) {
      setTimeout(() => {
        const header = headerRefs.current[index]
        if (!header) return
        const navbar = document.querySelector('nav')
        const currentNavbarBottom = navbar ? Math.max(0, navbar.getBoundingClientRect().bottom) : 0
        const rect = header.getBoundingClientRect()
        const scrollContainer = getScrollParent(header)
        const currentTop = scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop
        scrollContainer.scrollTo({
          top: currentTop + rect.top - currentNavbarBottom,
          behavior: 'smooth',
        })
      }, 400)
    }
  }

  return (
    <div className={styles.accordionContainer}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div
            ref={el => { headerRefs.current[index] = el }}
            className={styles.stickyHeader}
            style={{ top: hidden ? -(HEADER_HEIGHT + 8) : navbarBottom, zIndex: 10 + index }}
          >
            <div className={styles.dashedLine} />
            <button
              className={styles.accordionHeader}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span className={styles.accordionTitle}>{item.title}</span>
              <ChevronDown
                size={24}
                className={`${styles.accordionArrow} ${openIndex === index ? styles.accordionArrowOpen : ""}`}
              />
            </button>
          </div>
          <AccordionContent
            ref={el => { contentRefs.current[index] = el }}
            content={item.content}
            isOpen={openIndex === index}
          />
          <div className={styles.dashedLine} />
        </React.Fragment>
      ))}
    </div>
  )
}

export default Accordion
