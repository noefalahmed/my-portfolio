import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { portfolioContext } from '../data/portfolioContext'
import styles from './AiSearch.module.css'

const TIPS = [
  "Ask me anything",
  "Have you worked on dashboards?",
  "Can you do frontend work?",
  "Have you built design systems?",
  "Do you have AI experience?",
  "Have you done user research?",
  "Can you do accessibility work?",
  "What tools do you use?",
]

const SYSTEM_PROMPT = `You are an assistant on Noefal's design portfolio. Answer questions about his work, skills, and background.

Rules:
- Always respond in 1–2 complete sentences. Never cut off mid-sentence.
- Be direct and specific. Never say you don't know.
- If a relevant project exists, always end with a JSON link block (format below).
- If no specific project exists but the skill or domain is relevant, confirm it with a concrete detail — a tool used, a method applied, or a metric from his background.
- Never give a vague or non-committal answer. Every response should be affirmative and specific.

If linking to a project, end your response with this on its own line:
{"link": "/projects/slug", "label": "View project"}

${portfolioContext}`

function parseResponse(text) {
  const jsonMatch = text.match(/\{"link":\s*"([^"]+)",\s*"label":\s*"([^"]+)"\}/)
  if (jsonMatch) {
    return {
      content: text.replace(jsonMatch[0], '').trim(),
      link: jsonMatch[1],
      label: jsonMatch[2],
    }
  }
  return { content: text.trim(), link: null, label: null }
}

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }}>
    <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1"/>
    <path d="M6 4h4v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 4L5.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

export default function AiSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [answerExiting, setAnswerExiting] = useState(false)
  const [lastQuery, setLastQuery] = useState('')
  const [error, setError] = useState(null)

  const [tipIndex, setTipIndex] = useState(0)
  const [exiting, setExiting] = useState(false)
  const tickerPaused = focused || query.length > 0 || processing

  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (answer) {
      document.body.classList.add('has-ai-answer')
    } else {
      document.body.classList.remove('has-ai-answer')
    }
    return () => document.body.classList.remove('has-ai-answer')
  }, [answer])

  useEffect(() => {
    if (!answer) return
    const container = document.querySelector('[data-scroll-container]')
    if (!container) return
    const handleScroll = () => {
      if (container.scrollTop > window.innerHeight * 0.3) clearAnswer()
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [answer])

  useEffect(() => {
    if (tickerPaused) return
    const hold = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        setTipIndex(i => (i + 1) % TIPS.length)
        setExiting(false)
      }, 350)
    }, 3000)
    return () => clearTimeout(hold)
  }, [tipIndex, tickerPaused, exiting])

  const showTicker = !focused && query.length === 0 && !processing

  function clearAnswer() {
    setAnswerExiting(true)
    setTimeout(() => {
      setAnswer(null)
      setAnswerExiting(false)
    }, 300)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || processing) return

    setProcessing(true)
    setAnswer(null)
    setAnswerExiting(false)
    setError(null)
    setLastQuery(trimmed)
    setQuery('')
    inputRef.current?.blur()

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: trimmed }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        console.error('Gemini API error:', res.status, JSON.stringify(data))
        if (res.status === 429) throw new Error('rate_limit')
        throw new Error(`API error ${res.status}`)
      }
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      setAnswer(parseResponse(text))
    } catch (err) {
      console.error('AiSearch error:', err)
      setError(err.message === 'rate_limit'
        ? 'Daily limit reached — check back tomorrow or reach me on LinkedIn.'
        : 'Something went wrong. Please try again.'
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
    <div className={styles.wrapper}>
      <form className={styles.bar} onSubmit={handleSubmit} onClick={() => inputRef.current?.focus()}>
        {showTicker && (
          <div className={styles.ticker}>
            <span className={`${styles.tickerItem} ${exiting ? styles.exiting : ''}`}>
              {TIPS[tipIndex]}
            </span>
          </div>
        )}

        {processing ? (
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        ) : (
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={processing}
            autoComplete="off"
            spellCheck={false}
          />
        )}
      </form>

      {answer && !error && (
        <div className={`${styles.answer} ${answerExiting ? styles.answerExiting : ''}`}>
          <p className={styles.answerQuestion}>{lastQuery}</p>
          <p className={styles.answerText}>{answer.content}</p>
          {answer.link && (
            <span
              className={styles.answerLink}
              onClick={() => navigate(answer.link)}
            >
              {answer.label}
              <ExternalLinkIcon />
            </span>
          )}
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>

    {answer && !error && createPortal(
      <button className={`${styles.clearButton} ${answerExiting ? styles.clearButtonExiting : ''}`} onClick={clearAnswer} aria-label="Clear answer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Clear
      </button>,
      document.body
    )}
  </>
  )
}
