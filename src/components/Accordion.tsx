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
  const headerRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const update = () => {
      const navbar = document.querySelector('nav')
      if (navbar) setNavbarBottom(Math.max(0, navbar.getBoundingClientRect().bottom))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const toggle = (index: number) => {
    const isOpening = openIndex !== index
    setOpenIndex(openIndex === index ? null : index)

    if (isOpening) {
      // Wait for the previous accordion to begin closing and layout to shift
      setTimeout(() => {
        const content = contentRefs.current[index]
        if (!content) return
        const navbar = document.querySelector('nav')
        const currentNavbarBottom = navbar ? Math.max(0, navbar.getBoundingClientRect().bottom) : 0
        const stickyOffset = currentNavbarBottom + (index + 1) * HEADER_HEIGHT
        const rect = content.getBoundingClientRect()
        window.scrollTo({
          top: window.scrollY + rect.top - stickyOffset,
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
            style={{ top: navbarBottom + index * HEADER_HEIGHT, zIndex: 10 + index }}
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
