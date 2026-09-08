import { useRef, useEffect, useLayoutEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'
import styles from './VoiceUX.module.css'
import Header from '../../components/Header'
import ConversationSnippet from '../../components/ConversationSnippet'
import ConversationShowcase from '../../components/ConversationShowcase'
import ArchitectureDiagram from '../../components/ArchitectureDiagram'
import AsteriskDiagram from '../../components/AsteriskDiagram'


const PROBLEM_TEXT = "How do we design a realistic experience for students to practice and get better at giving and receiving feedback?"

const IpadVideoPlayer: React.FC<{ src: string; isActive?: boolean; style?: React.CSSProperties }> = ({ src, isActive, style }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (isActive) video.play().catch(() => {})
        else video.pause()
    }, [isActive])

    return (
        <div className={styles.ipadShowcase} style={style}>
            <div className={styles.ipadFrame}>
                <video ref={videoRef} className={styles.ipadVideo} src={src} muted loop playsInline />
            </div>
        </div>
    )
}


const PROMPT_TEXT = `Animation Name: Organic Line Wiggle

Element:
- SVG path

Motion Type:
- Horizontal translation
- Shape morphing

Duration:
- 2000ms

Easing:
- cubic-bezier(0.37, 0, 0.63, 1)

Loop:
- infinite
- seamless

Keyframes:
- 0%   → resting wave
- 25%  → expanded wave
- 50%  → peak curvature
- 75%  → compressed wave
- 100% → return to resting wave

Movement Range:
- X-axis: -120px → +120px

Visual Style:
- Minimal
- Organic
- Fluid
- Ambient motion

Performance Constraints:
- 60fps target
- GPU-friendly transforms
- No visible jump between loops

Output Requirements:
- Smooth continuous animation
- Natural wave deformation
- Subtle and premium motion feel`

const MobilePreview: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const scale = () => {
            if (!containerRef.current || !iframeRef.current) return
            const s = containerRef.current.offsetWidth / 430
            iframeRef.current.style.transform = `scale(${s})`
            containerRef.current.style.height = `${Math.round(932 * s)}px`
        }
        scale()
        const obs = new ResizeObserver(scale)
        if (containerRef.current) obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    return (
        <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', borderRadius: 10, transform: 'translateZ(0)', clipPath: 'inset(0 round 16px)', background: '#fff', ...style }}>
            <iframe
                ref={iframeRef}
                src={src}
                style={{ width: 430, height: 932, border: 'none', display: 'block', transformOrigin: 'top left', pointerEvents: 'none' }}
            />
        </div>
    )
}

const MicroanimSlide: React.FC = () => {
    const [view, setView] = useState<'v1'|'figma'|'prompt'|'v2'>('v1')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    return (
        <div className={styles.projectSlideScroll}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
                    <div style={{ position: 'relative', width: 'calc(75vw - 100px)', height: 'calc(100vh - 280px)' }}>
                        <video
                            ref={videoRef}
                            src="./assets/microanim.mov"
                            className={`${styles.image} ${styles['image-dynamic']}`}
                            autoPlay muted loop playsInline
                            style={{ display: view === 'v1' ? 'block' : 'none', margin: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {view === 'figma' && (
                            <img src="./assets/microanim-figma.png" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 12, background: '#111' }} />
                        )}
                        {view === 'v2' && (
                            <video src="./assets/microanim-v2.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', margin: 0 }} autoPlay muted loop playsInline />
                        )}
                        {view === 'prompt' && (
                            <pre style={{
                                fontFamily: '"IBM Plex Mono", monospace',
                                fontSize: 13,
                                fontWeight: 400,
                                lineHeight: 1.8,
                                color: '#d8d8d8',
                                background: '#0d0d0f',
                                border: '1px solid #222428',
                                borderRadius: 12,
                                padding: '40px 48px',
                                margin: 0,
                                width: '100%',
                                height: '100%',
                                boxSizing: 'border-box' as const,
                                whiteSpace: 'pre-wrap',
                                overflowX: 'hidden',
                                overflowY: 'auto',
                            }}>{PROMPT_TEXT}</pre>
                        )}
                        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                            <button
                                onClick={() => setDropdownOpen(o => !o)}
                                style={{
                                    fontFamily: '"IBM Plex Mono", monospace',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: '#888',
                                    background: '#0d0d0f',
                                    border: '1px solid #333',
                                    borderRadius: 6,
                                    padding: '5px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                {view.toUpperCase()} <span style={{ fontSize: 9 }}>▼</span>
                            </button>
                            {dropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 4px)',
                                    left: 0,
                                    background: '#0d0d0f',
                                    border: '1px solid #333',
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    minWidth: '100%',
                                }}>
                                    {(['V1', 'Figma', 'Prompt', 'V2'] as const).map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => { setView(opt.toLowerCase() as 'v1'|'figma'|'prompt'|'v2'); setDropdownOpen(false); }}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'left',
                                                fontFamily: '"IBM Plex Mono", monospace',
                                                fontSize: 11,
                                                fontWeight: 500,
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                                color: view === opt.toLowerCase() ? '#fff' : '#888',
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className={styles.p1} style={{ width: 'calc(50vw - 72px)', margin: 0 }}>The mic animating while the student speaks, the processing state, the AI's voice coming back while its words appear on screen; all of it needed to be felt, not specced.</p>
            </div>
        </div>
    )
}

const ROLEPLAY_CARDS = [
    { id: 'eli',    title: 'Younger Student Lateness',          with: 'Eli',    role: 'Mentee',    desc: 'A younger student you mentor keeps showing up late to your meetings. You need to address this pattern of behavior and help them understand the impact while maintaining your supportive mentoring relationship.', bg: '/assets/sc-roleplay-bg-eli.png',    avatar: '/assets/sc-roleplay-avatar-eli.png',    audio: '/assets/sc-roleplay-audio-eli.mp3',    left: 313, top: 0,   z: 5 },
    { id: 'arnold', title: 'Professor Feedback on Organization', with: 'Arnold', role: 'Professor', desc: 'Your professor has called a meeting to give you feedback about your lack of organization. You need to receive this feedback professionally, understand their concerns, and work toward improvement.',                bg: '/assets/sc-roleplay-bg-arnold.png', avatar: '/assets/sc-roleplay-avatar-arnold.png', audio: '/assets/sc-roleplay-audio-arnold.mp3', left: 233, top: 138, z: 4 },
    { id: 'bella',  title: "Friend's Article",                  with: 'Bella',  role: 'Friend',    desc: "Your friend asks you for honest feedback on an article they wrote. The problem is: you really didn't like it. You need to give honest but kind feedback that helps them improve without damaging the friendship.",  bg: '/assets/sc-roleplay-bg-bella.png',  avatar: '/assets/sc-roleplay-avatar-bella.png',  audio: '/assets/sc-roleplay-audio-bella.mp3',  left: 153, top: 276, z: 3 },
    { id: 'drew',   title: 'Team Leader Communication',         with: 'Drew',   role: 'Team Lead', desc: "Your project team leader does not communicate expectations clearly. You need to give upward feedback about how unclear direction is affecting the team's work and your ability to meet goals.",                       bg: '/assets/sc-roleplay-bg-drew.png',   avatar: '/assets/sc-roleplay-avatar-drew.png',   audio: '/assets/sc-roleplay-audio-alex.mp3',   left: 73,  top: 414, z: 2 },
    { id: 'alex',   title: 'Classmate Group Project',           with: 'Alex',   role: 'Classmate', desc: 'You need to give feedback to Alex about the quality of their contribution to your group project. Their work has issues (missed deadlines, unequal contribution, or quality problems) and you need to address this constructively.', bg: '/assets/sc-roleplay-bg-alex.png', avatar: '/assets/sc-roleplay-avatar-alex.png', audio: '/assets/sc-roleplay-audio-drew.mp3', left: 0, top: 552, z: 1 },
]

const DESIGN_W = 886
const DESIGN_H = 760

const ScenarioStackedCards: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [hovered, setHovered] = useState<string | null>(null)
    const [playing, setPlaying] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const obs = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            setScale(Math.min(width / DESIGN_W, height / DESIGN_H) * 0.82)
        })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#fcfcfc', backgroundImage: 'url(/assets/sc-texture.png)', backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
            {/* Interactive chip */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.85)', border: '0.5px solid #ddd', borderRadius: 100, backdropFilter: 'blur(8px)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}><path d="M4 4l7 18 3.5-7L22 11.5 4 4z" fill="white" stroke="#555"/></svg>
                Interactive
            </div>
            <div style={{ position: 'absolute', width: DESIGN_W, height: DESIGN_H, transformOrigin: 'top center', transform: `scale(${scale})`, left: '50%', marginLeft: -DESIGN_W / 2, top: '50%', marginTop: -(DESIGN_H * scale) / 2 }}>
                {ROLEPLAY_CARDS.map(card => (
                    <div
                        key={card.id}
                        onMouseEnter={() => {
                            setHovered(card.id)
                            audioRef.current?.pause()
                            const a = new Audio(card.audio)
                            audioRef.current = a
                            a.play()
                            setPlaying(card.id)
                            a.onended = () => setPlaying(null)
                        }}
                        onMouseLeave={() => {
                            setHovered(null)
                            audioRef.current?.pause()
                            audioRef.current = null
                            setPlaying(null)
                        }}
                        style={{
                            position: 'absolute', left: card.left, top: card.top, width: 573, height: 219,
                            zIndex: hovered === card.id ? 10 : card.z,
                            display: 'flex', alignItems: 'stretch',
                            background: 'white',
                            border: `0.5px solid ${hovered === card.id ? '#888' : '#a4a4a4'}`,
                            borderRadius: 13, overflow: 'hidden', cursor: 'pointer',
                            transform: hovered === card.id ? 'translateY(-8px)' : 'translateY(0)',
                            boxShadow: 'none',
                            outline: hovered === card.id ? '1.5px solid #aaa' : '1.5px solid transparent',
                            transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), outline-color 0.3s ease, border-color 0.3s ease',
                        }}
                    >
                        <div style={{ position: 'relative', width: 219, flexShrink: 0 }}>
                            <img src={card.bg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#222', lineHeight: 1.2, margin: 0 }}>{card.title}</p>
                                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, fontWeight: 400, color: '#222', lineHeight: 1.2, margin: 0 }}>
                                    with <strong style={{ fontWeight: 500 }}>{card.with}</strong>, your <strong style={{ fontWeight: 500 }}>{card.role}</strong>.
                                </p>
                            </div>
                            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 400, color: '#373737', lineHeight: 1.65, margin: 0 }}>{card.desc}</p>
                        </div>
                        <div
                            style={{ position: 'absolute', left: 50.58, top: 50.58, width: 116, height: 116, borderRadius: '50%', overflow: 'hidden' }}
                        >
                            <img src={card.avatar} alt={card.with} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {/* Dark overlay */}
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: (hovered === card.id || playing === card.id) ? 1 : 0, transition: 'opacity 0.3s ease' }} />
                            {/* Play icon */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (hovered === card.id && playing !== card.id) ? 1 : 0, transition: 'opacity 0.25s ease' }}>
                                <svg width="32" height="32" viewBox="0 0 20 20" fill="white"><polygon points="6,3 17,10 6,17" /></svg>
                            </div>
                            {/* Audio bars */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, opacity: playing === card.id ? 1 : 0, transition: 'opacity 0.25s ease' }}>
                                {[{ h: 14, d: '0s' }, { h: 22, d: '0.15s' }, { h: 14, d: '0.3s' }].map((bar, i) => (
                                    <div key={i} style={{ width: 4, height: bar.h, background: 'white', borderRadius: 2, transformOrigin: 'center', animation: playing === card.id ? `scAudioBar 0.6s ease-in-out ${bar.d} infinite alternate` : 'none' }} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const VOICEUX_SLIDE_COUNT = 14

export interface VoiceUXHandle { getSlideEl: (index: number) => HTMLElement | null }

const VoiceUX = forwardRef<VoiceUXHandle, { slideIndex: number; onNavigate?: (globalSlide: number) => void; slideStart?: number }>(({ slideIndex, onNavigate, slideStart = 0 }, ref) => {
    const pageRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => ({ getSlideEl: (i: number) => (pageRef.current?.children[i] as HTMLElement) ?? null }), [])
    const [typedText, setTypedText] = useState('')
    const [mobileReloadKey, setMobileReloadKey] = useState(0)
    const [hoverDot, setHoverDot] = useState<number | null>(null)
    const dotRefs = useRef<Array<HTMLDivElement | null>>([])
    const previewContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = pageRef.current
        if (!el) return
        const slides = Array.from(el.children) as HTMLElement[]
        slides.forEach((slide, i) => {
            if (i === slideIndex) {
                slide.style.opacity = ''
                slide.style.pointerEvents = 'auto'
                slide.classList.remove(styles.slideExitUp)
                void slide.offsetWidth
                slide.classList.add(styles.slideEnter)
            } else {
                slide.style.opacity = '0'
                slide.style.pointerEvents = 'none'
                slide.classList.remove(styles.slideEnter)
            }
        })
    }, [slideIndex])

    useEffect(() => {
        if (slideIndex !== 2) return
        const id = setInterval(() => setMobileReloadKey(k => k + 1), 4000)
        return () => clearInterval(id)
    }, [slideIndex])

    useEffect(() => {
        if (slideIndex !== 3) return
        let i = 0
        setTypedText('')
        const id = setInterval(() => {
            i++
            setTypedText(PROBLEM_TEXT.slice(0, i))
            if (i >= PROBLEM_TEXT.length) clearInterval(id)
        }, 18)
        return () => clearInterval(id)
    }, [slideIndex])

    useLayoutEffect(() => {
        const container = previewContainerRef.current
        if (!container) return
        while (container.firstChild) container.removeChild(container.firstChild)
        if (hoverDot === null || !pageRef.current) return
        const slideEl = pageRef.current.children[hoverDot] as HTMLElement
        if (!slideEl) return
        const clone = slideEl.cloneNode(true) as HTMLElement
        clone.style.position = 'absolute'
        clone.style.inset = '0'
        clone.style.opacity = '1'
        clone.style.pointerEvents = 'none'
        clone.style.transform = 'none'
        container.appendChild(clone)
    }, [hoverDot])

    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    return (
        <>
        <div className={styles.page} ref={pageRef}>

            {/* Slide 1: Header */}
            <div className={styles.projectSlide}>
                <Header
                    title="i built a speech-enabled leadership coach for students."
                    imageSrc="./assets/proj0.png"
                    imageAlt="Speech-enabled leadership coach"
                    details={[
                        { label: "Company", value: "Cornell University" },
                        { label: "Role", value: "Lead Product Designer" },
                        { label: "Skills", value: "Voice UX\nConversation Design\nRapid Prototyping" },
                    ]}
                />
            </div>

            {/* Slide 2a: Main image */}
            <div className={styles.projectSlide}>
                <div style={{ position: 'absolute', top: '104px', left: '64px', right: '64px', bottom: '40px', borderRadius: 16, overflow: 'hidden' }}>
                    <ConversationShowcase bgImage="/assets/sc-bg.png" fullscreen />
                </div>
            </div>

            {/* Slide 2b: Bottom row */}
            <div className={styles.projectSlide} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 16, width: '100%', height: 'calc(100vh - 300px)', alignItems: 'stretch', justifyContent: 'center' }}>
                        <video key={slideIndex === 2 ? 'dash-active' : 'dash'} src="/assets/home-video.mov" autoPlay muted playsInline style={{ flex: '0 0 55%', height: '100%', objectFit: 'cover', borderRadius: 16, display: 'block' }} onTimeUpdate={e => { if (e.currentTarget.currentTime >= 4) e.currentTarget.currentTime = 0 }} />
                        <div style={{ flex: '0 0 auto', alignSelf: 'stretch', aspectRatio: '430/932', overflow: 'hidden', borderRadius: 16 }}>
                            <MobilePreview key={slideIndex === 2 ? `mobile-${mobileReloadKey}` : 'mobile'} src="/leadership-coach/mobile-home.html" style={{ borderRadius: 16 }} />
                        </div>
                    </div>
            </div>

            {/* Slide 3: Intro text */}
            {/* <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largetext}>
                        Engineering students are trained to solve hard problems, but nobody teaches them how to tell a teammate their work isn't good enough.<br /><br />Cornell's Duffield College of Engineering, home to over 3,000 undergraduates, needed a way to build that muscle before students hit the real world. So I designed and built a speech-enabled AI coach that lets students practice the uncomfortable conversations, delivers feedback on how they handled it, and gets more valuable the more they use it.
                    </div>
                </div>
            </div> */}

            {/* Slide 3b: Problem Statement */}
            <div className={styles.projectSlideTop} style={{ paddingLeft: 'calc(96px + (100vw - 240px) / 4)', paddingRight: 'calc(96px + (100vw - 240px) / 4)', alignItems: 'center' }}>
                <div className={styles.largeTextBlock}>
                    <span className={styles.problemTag}>Problem Statement</span>
                    <div className={styles.largeTextWrapper}>
                        <div className={styles.largeTextGhost}>{PROBLEM_TEXT}</div>
                        <div className={styles.largeTextTyped}>{typedText}<span className={styles.typedCursor} /></div>
                    </div>
                </div>
            </div>

            {/* Slide 6: The Process — title */}
            {/* <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>The Process</h2>
                    </div>
                </div>
            </div> */}

            {/* Slide 7: Architecture */}
            <div className={styles.projectSlide} style={{ paddingLeft: 'calc(80px + (100vw - 240px) / 8)', paddingRight: 'calc(80px + (100vw - 240px) / 8)', boxSizing: 'border-box' }}>
                <ArchitectureDiagram key={slideIndex === 4 ? slideIndex : 'arch'} />
            </div>

            {/* Slide 9: Roleplayers — diagram */}
            <div className={styles.projectSlide} style={{ paddingLeft: 'calc(80px + (100vw - 240px) / 8)', paddingRight: 'calc(80px + (100vw - 240px) / 8)', boxSizing: 'border-box' }}>
                <AsteriskDiagram key={slideIndex === 5 ? slideIndex : 'asterisk'} />
            </div>

            {/* Slide 10: Roleplayers — scenarios */}
            <div className={styles.projectSlideScroll}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 64, width: '100%', padding: '0 80px', boxSizing: 'border-box', height: 'calc(100vh - 180px)' }}>
                    <p className={styles.p1} style={{ flex: '0 0 auto', width: 'calc(22vw)', margin: 0 }}>The agentic characters I built were drawn from real relationships from a students academic journey: a peer, a mentor, teamleader, a friend</p>
                    <div style={{ flex: '0 0 72%', minWidth: 0, height: '100%', borderRadius: 8, overflow: 'hidden' }}>
                        <ScenarioStackedCards />
                    </div>
                </div>
            </div>

            {/* Slide 11: Conversation — blueprint */}
            <div className={styles.projectSlideScroll}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 64, width: '100%', padding: '0 80px', boxSizing: 'border-box' }}>
                    <p className={styles.p1} style={{ flex: '0 0 auto', width: 'calc(22vw)', margin: 0 }}>Underneath every scenario, the structure was the same: a hero's arc. The opening, the tension, the effort to hold ground, the climax, the resolution. That gave us a skeleton for all conversations to lay on top of.</p>
                    <img data-zoom src="./assets/sc-service-blueprint.png" style={{ flex: 1, minWidth: 0, height: 'auto', display: 'block', borderRadius: 8 }} />
                </div>
            </div>

            {/* Slide 12: Conversation — flaws */}
            <div className={styles.projectSlideScroll}>
                <div style={{ width: 'calc(50vw - 72px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Latency</h2>
                        <p className={styles.p1}>We saw that the conversations were falling apart due to awkward pauses between the student and AI. This was partly a model constraint (GPT Realtime) and it took us a while to realize that.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Context Pollution</h2>
                        <p className={styles.p1}>Since I designed for a single roleplay agent to handle every scenario, the conversations were not as tailored as we had liked. Context pollution in the prompts meant the AI would drift, lose the thread of the scenario, or respond in ways that felt off.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Intangible Difficulty</h2>
                        <p className={styles.p1}>The differences between supportive, standard, and challenging weren't tangible enough. The AI needed to break at just the right moment for a given level, which it was mixing up.</p>
                    </div>
                </div>
            </div>

            {/* Slide 13: Conversation — pivot */}
            <div className={styles.projectSlideScroll}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 64, width: '100%', padding: '0 80px', boxSizing: 'border-box' }}>
                    <p className={styles.p1} style={{ flex: '0 0 auto', width: 'calc(22vw)', margin: 0 }}>So, we switched from GPT-4o Realtime to ElevenLabs — our first strategic shift. Latency improved, the agents felt distinct and autonomous, and difficulty was felt more concretely in the interactions.</p>
                    <img data-zoom src="./assets/sc-sysarch2.png" style={{ flex: 1, minWidth: 0, height: 'auto', display: 'block', borderRadius: 8 }} />
                </div>
            </div>

            {/* Slide 14: Feedback — SBI */}
            <div className={styles.projectSlideScroll} style={{ paddingTop: '110px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: 10,
                    width: 'calc(100% - 128px)',
                    height: 'calc(100vh - 180px)',
                    marginLeft: '64px',
                    marginRight: '64px',
                }}>
                    <div style={{ gridColumn: '1', gridRow: '1 / 3', background: '#111', borderRadius: 8, border: '1px solid #222', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <video src="./assets/sc-recording-feedback-v1.mov" style={{ width: '100%', height: '200%', objectFit: 'cover', objectPosition: 'bottom', display: 'block', flexShrink: 0, transform: 'translateY(-5%)' }} autoPlay muted loop playsInline />
                    </div>
                    <div style={{ gridColumn: '2', gridRow: '1', background: '#111', borderRadius: 8, border: '1px solid #222', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <video src="./assets/sc-recording-feedback-v2.mov" style={{ width: '160%', height: 'auto', display: 'block' }} autoPlay muted loop playsInline />
                    </div>
                    <div style={{ gridColumn: '3', gridRow: '1', background: '#111', borderRadius: 8, border: '1px solid #222', overflow: 'hidden' }}>
                        <video src="./assets/microanim-v2.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} autoPlay muted loop playsInline />
                    </div>
                    <div style={{ gridColumn: '2 / 4', gridRow: '2', background: '#111', borderRadius: 8, border: '1px solid #222', overflow: 'hidden' }}>
                        <video src="./assets/sc-recording-feedback-v3.mov" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} autoPlay muted loop playsInline />
                    </div>
                </div>
            </div>

            {/* Microinteractions */}
            <div className={styles.projectSlideScroll} style={{ paddingTop: '106px' }}>
                <video src="./assets/sc-anims.mp4" style={{ width: 'calc(75vw - 100px)', height: 'auto', display: 'block', borderRadius: 8 }} autoPlay muted loop playsInline />
            </div>

            {/* Rapid Prototyping */}
            <div className={styles.projectSlideScroll}>
                <img data-zoom src="./assets/sc-rapid-prototyping.png" style={{ width: 'calc(75vw - 100px)', height: 'auto', display: 'block', borderRadius: 8 }} />
            </div>

            {/* Walkthrough */}
            <div className={styles.projectSlideScroll} style={{ paddingTop: '110px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <video src="./assets/sc-walkthrough.mov" style={{ width: 'calc(85vw - 100px)', height: 'auto', display: 'block', borderRadius: 8 }} autoPlay muted loop playsInline />
                </div>
            </div>



        </div>

        {createPortal(
            slideIndex >= 0 && slideIndex < VOICEUX_SLIDE_COUNT ? (
            <>
                {slideIndex > 0 && (() => {
                    const labels: Record<number, string> = {
                        2: 'Home Page',
                        4: 'Understanding the System',
                        5: 'Designing the Roleplayers',
                        6: 'AI Agents',
                        7: 'Designing the Conversation',
                        8: 'Critical Issues',
                        9: 'The Pivot',
                        10: 'Designing for AI',
                        11: 'Explorations',
                        12: 'Explorations',
                        13: 'Full Walkthrough',
                    }
                    const label = labels[slideIndex] ?? 'Voice UX'
                    return (
                        <span style={{ position: 'fixed', top: 64, left: 64, fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, color: '#e8e8e8', letterSpacing: '0.02em', zIndex: 9999, pointerEvents: 'none' }}>
                            Cornell / {label}
                        </span>
                    )
                })()}
                {hoverDot !== null && (() => {
                    const dotEl = dotRefs.current[hoverDot]
                    const dotRect = dotEl?.getBoundingClientRect()
                    const previewW = 240
                    const previewH = Math.round(240 * window.innerHeight / window.innerWidth)
                    const scale = previewW / window.innerWidth
                    const centerY = dotRect ? dotRect.top + dotRect.height / 2 : window.innerHeight / 2
                    const top = Math.min(Math.max(centerY - previewH / 2, 16), window.innerHeight - previewH - 16)
                    return (
                        <div
                            onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current) }}
                            onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setHoverDot(null), 150) }}
                            onClick={() => onNavigate?.(slideStart + hoverDot)}
                            style={{ position: 'fixed', right: 48, top, width: previewW, height: previewH, overflow: 'hidden', borderRadius: 8, border: '1px solid #2a2a2a', background: '#0d0d0d', zIndex: 9998, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
                        >
                            <div style={{ position: 'relative', width: window.innerWidth, height: window.innerHeight, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                                <div ref={previewContainerRef} style={{ position: 'absolute', inset: 0 }} />
                            </div>
                        </div>
                    )
                })()}
            </>
            ) : <></>,
            document.body
        )}

        </>
    )
})

export default VoiceUX
