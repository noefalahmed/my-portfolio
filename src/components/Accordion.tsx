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

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.accordionContainer}>
      {items.map((item, index) => (
        <AccordionPanel
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  )
}

interface AccordionPanelProps {
  title: string
  content: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ title, content, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div className={styles.accordionItem}>
      <div className={styles.dashedLine} />
      <button
        className={styles.accordionHeader}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.accordionTitle}>{title}</span>
        <ChevronDown
          size={24}
          className={`${styles.accordionArrow} ${isOpen ? styles.accordionArrowOpen : ""}`}
        />
      </button>
      <div
        className={styles.accordionContent}
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className={styles.accordionContentInner}>
          {content}
        </div>
      </div>
      <div className={styles.dashedLine} />
    </div>
  )
}

export default Accordion
