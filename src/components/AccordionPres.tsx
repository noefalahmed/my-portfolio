"use client"

import React, { useState, useRef, useEffect } from "react"
import styles from "./AccordionPres.module.css"
import { ChevronDown } from "lucide-react"

interface AccordionItem {
  title: string
  content?: React.ReactNode
  slides?: React.ReactNode[]
}

interface AccordionProps {
  items: AccordionItem[]
  titleClassName?: string
}

const HEADER_HEIGHT = 57

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  { content?: React.ReactNode; slides?: React.ReactNode[]; isOpen: boolean }
>(({ content, slides, isOpen }, outerRef) => {
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

  const rendered = slides
    ? slides.map((slide, i) => (
        <div key={i} className={styles.presSlide}>
          {slide}
        </div>
      ))
    : content

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
        {rendered}
      </div>
    </div>
  )
})

const AccordionPres: React.FC<AccordionProps> = ({ items, titleClassName }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [navbarBottom, setNavbarBottom] = useState(0)
  const headerRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

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
    const update = () => {
      const navbar = document.querySelector('nav')
      setNavbarBottom(navbar ? Math.max(0, navbar.getBoundingClientRect().bottom) : 0)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
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
            style={{ top: navbarBottom + index * HEADER_HEIGHT, zIndex: 10 + index }}
          >
            <div className={styles.dashedLine} />
            <button
              className={styles.accordionHeader}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span className={titleClassName ?? styles.accordionTitle}>{item.title}</span>
              <ChevronDown
                size={24}
                className={`${styles.accordionArrow} ${openIndex === index ? styles.accordionArrowOpen : ""}`}
              />
            </button>
          </div>
          <AccordionContent
            ref={el => { contentRefs.current[index] = el }}
            content={item.content}
            slides={item.slides}
            isOpen={openIndex === index}
          />
          <div className={styles.dashedLine} />
        </React.Fragment>
      ))}
    </div>
  )
}

export default AccordionPres
