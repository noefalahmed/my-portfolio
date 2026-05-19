import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './VoiceUX.module.css'
import Header from '../../components/Header'
import ConversationSnippet from '../../components/ConversationSnippet'
import ArchitectureDiagram from '../../components/ArchitectureDiagram'
import AsteriskDiagram from '../../components/AsteriskDiagram'


const PROBLEM_TEXT = "How do we design a realistic experience for students to practice and get better at giving and receiving feedback?"

const IpadVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) video.play().catch(() => {})
                else video.pause()
            },
            { threshold: 0.5 }
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    return (
        <div className={styles.ipadShowcase}>
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

const MicroanimSlide: React.FC = () => {
    const [view, setView] = useState<'v1'|'figma'|'prompt'|'v2'>('v1')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoHeight, setVideoHeight] = useState<number | undefined>(undefined)

    useEffect(() => {
        const v = videoRef.current
        if (!v) return
        const measure = () => setVideoHeight(v.offsetHeight)
        v.addEventListener('loadedmetadata', measure)
        if (v.readyState >= 1) measure()
        return () => v.removeEventListener('loadedmetadata', measure)
    }, [])

    return (
        <div className={styles.projectSlideScroll}>
            <div className={styles.contentcontainer}>
                <div className={styles.subsection}>
                    <div style={{ position: 'relative', width: '100%', height: videoHeight ?? 'auto' }}>
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
                            <video src="./assets/microanim-v2.mov" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', margin: 0 }} autoPlay muted loop playsInline />
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
                    <p className={styles.p1}>The mic animating while the student speaks, the processing state, the AI's voice coming back while its words appear on screen; all of it needed to be felt, not specced.</p>
                </div>
            </div>
        </div>
    )
}

const VoiceUX: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [totalSlides, setTotalSlides] = useState(0)
    const slideRef = useRef<HTMLDivElement>(null)
    const [typedText, setTypedText] = useState('')
    const [slideVisible, setSlideVisible] = useState(false)

    useEffect(() => {
        const el = slideRef.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setSlideVisible(true)
        }, { threshold: 0.3 })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!slideVisible) return
        let i = 0
        setTypedText('')
        const id = setInterval(() => {
            i++
            setTypedText(PROBLEM_TEXT.slice(0, i))
            if (i >= PROBLEM_TEXT.length) clearInterval(id)
        }, 18)
        return () => clearInterval(id)
    }, [slideVisible])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!pageRef.current) return
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') pageRef.current.scrollBy({ top: window.innerHeight })
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') pageRef.current.scrollBy({ top: -window.innerHeight })
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        const el = pageRef.current
        if (!el) return
        setTotalSlides(el.children.length)
        const handleScroll = () => setCurrentSlide(Math.round(el.scrollTop / window.innerHeight))
        el.addEventListener('scroll', handleScroll, { passive: true })
        return () => el.removeEventListener('scroll', handleScroll)
    }, [])

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
                        { label: "Duration", value: "Ongoing" },
                        { label: "Skills", value: "Voice UX, Conversation Design, Rapid Prototyping" },
                    ]}
                />
            </div>

            {/* Slide 2a: Main image */}
            <div className={styles.projectSlide}>
                <img src="./assets/main.png" alt="Speech coach conversation UI" style={{ maxWidth: '96%', maxHeight: '96%', objectFit: 'contain', display: 'block' }} />
            </div>

            {/* Slide 2b: Bottom row */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.conversationRow}>
                    <div className={styles.conversationSnippetRow}>
                        <ConversationSnippet />
                        <img data-zoom src="./assets/sc-progress-dashboard.png" alt="Progress dashboard" className={styles.conversationPlaceholder} />
                    </div>
                </div>
            </div>

            {/* Slide 3: Intro text */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largetext}>
                        Engineering students are trained to solve hard problems, but nobody teaches them how to tell a teammate their work isn't good enough.<br /><br />Cornell's Duffield College of Engineering, home to over 3,000 undergraduates, needed a way to build that muscle before students hit the real world. So I designed and built a speech-enabled AI coach that lets students practice the uncomfortable conversations, delivers feedback on how they handled it, and gets more valuable the more they use it.
                    </div>
                </div>
            </div>

            {/* Slide 3b: Problem Statement */}
            <div className={styles.projectSlideTop} ref={slideRef}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largeTextBlock}>
                        <span className={styles.problemTag}>Problem Statement</span>
                        <div className={styles.largeTextWrapper}>
                            <div className={styles.largeTextGhost}>{PROBLEM_TEXT}</div>
                            <div className={styles.largeTextTyped}>{typedText}<span className={styles.typedCursor} /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 6: The Process — title */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>The Process</h2>
                    </div>
                </div>
            </div>

            {/* Slide 7: Architecture */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>Understanding the System</span>
                        <ArchitectureDiagram />
                        <p className={styles.p1}>Before designing anything, we needed to agree on what we were actually building. As a tiger team of 3, including a PM/researcher, an AI engineer, and myself leading design, we mapped out an MVP system architecture early. This revealed overlapping areas of the system that needed to be truly designed, such as the agents, the conversation, feedback, Human-AI interactions, and finally the UI.</p>
                    </div>
                </div>
            </div>

            {/* Slide 9: Roleplayers — diagram */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>Designing the Roleplayers</span>
                        <AsteriskDiagram />
                        <p className={styles.p1}>A convincing roleplayer is a whole person, not just a prompt with a name on it. Every week we refined what that meant, layering in what each character needed to feel distinct and believable.</p>
                    </div>
                </div>
            </div>

            {/* Slide 10: Roleplayers — scenarios */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <img data-zoom src="./assets/scenarios.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <p className={styles.p1}>The scenarios split into two categories: peer-to-peer and peer-to-authority. Giving hard feedback to a teammate is a different skill from pushing back on a professor who doesn't think your concern is valid.</p>
                    </div>
                </div>
            </div>

            {/* Slide 11: Conversation — blueprint */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>Designing the Conversation</span>
                        <img data-zoom src="./assets/sc-service-blueprint.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <p className={styles.p1}>Underneath every scenario, the structure was the same: a hero's arc. The opening, the tension, the effort to hold ground, the climax, the resolution. That gave us a skeleton for all conversations to lay on top of.</p>
                    </div>
                </div>
            </div>

            {/* Slide 12: Conversation — flaws */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.sub1section} style={{ gap: '20px' }}>
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
            </div>

            {/* Slide 13: Conversation — pivot */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <img data-zoom src="./assets/sc-sysarch2.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <p className={styles.p1}>So, we switched from GPT-4o Realtime to ElevenLabs — our first strategic shift. Latency improved, the agents felt distinct and autonomous, and difficulty was felt more concretely in the interactions.</p>
                    </div>
                </div>
            </div>

            {/* Slide 13: Feedback — SBI */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>Designing the Feedback</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <img data-zoom src="./assets/sc-sbi.png" className={`${styles.image} ${styles['image-dynamic']}`} style={{ margin: 0 }} />
                            <img data-zoom src="./assets/sc-sbi2.png" className={`${styles.image} ${styles['image-dynamic']}`} style={{ margin: 0 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 15: Feedback — SBI-4 */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <img data-zoom src="./assets/SBI-4.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                </div>
            </div>

            {/* Slide 16: Feedback — specs */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <img data-zoom src="./assets/specs.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <p className={styles.p1}>After the conversation ends, the feedback moves through a deliberate arc — emotional first, then analytical, then actionable.</p>
                    </div>
                </div>
            </div>

            {/* Slide 17: Feedback — demo */}
            <div className={styles.projectSlide}>
                <IpadVideoPlayer src="./assets/sc-feedback-demo.mp4" />
            </div>

            {/* Slide 15: UI — Rapid Prototyping */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>Rapid Prototyping</span>
                        <p className={styles.p1}>A lot of the prototyping was focused on conversational UI components specifically. I built and dropped in components quickly to test whether students understood the affordances, responded the way we expected, and felt oriented within the experience.</p>
                        <img data-zoom src="./assets/sc-rapid-prototyping.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                    </div>
                </div>
            </div>

            {/* Slide 16: UI — Microinteractions 1 */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.subsection}>
                        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>Microinteractions</span>
                        <video src="./assets/sc-anims.mov" className={`${styles.image} ${styles['image-dynamic']}`} autoPlay muted loop playsInline />
                    </div>
                </div>
            </div>

            {/* Slide 17: UI — Microinteractions 2 */}
            <MicroanimSlide />

            {/* Slide 12: The Result — title */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>The Result</h2>
                    </div>
                </div>
            </div>

            {/* Slide 13: Result content */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largetext}>
                        The product is still in active development. But the early signal is clear.<br /><br />
                        Perceived product value came in at +79% — measured across usefulness, realism, and trust.
                    </div>
                </div>
            </div>

            {/* Slide 14: The Big Picture — title */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>The Big Picture</h2>
                    </div>
                </div>
            </div>

            {/* Slide 15a: Big picture — Leadership */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.sub1section}>
                        <img data-zoom src="./assets/Future.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Leadership as a measurable skill</h2>
                            <p className={styles.p1}>Cornell's long-term vision is to make this a graduation requirement.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 15b: Big picture — Practice loop */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <div className={styles.sub1section}>
                        <img data-zoom src="./assets/graphs.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Adding more Value</h2>
                            <p className={styles.p1}>A single session is useful. But the real value is in the accumulation. I built an early version of a progress dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 16: End */}
            <div className={styles.projectSlide}>
                <button onClick={() => { const page = pageRef.current; if (page) page.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ padding: '20px 48px', background: 'transparent', border: '1px solid #333', borderRadius: 999, color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    ↑  BACK TO TOP
                </button>
            </div>

        </div>

        {createPortal(
            <>
                <a href="/slides?s=1" style={{ position: 'fixed', left: 24, top: 24, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 400, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none', zIndex: 9999, pointerEvents: 'auto', textTransform: 'uppercase' }}>
                    ‹ Cases
                </a>
                <div style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, pointerEvents: 'none' }}>
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === currentSlide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transform: i === currentSlide ? 'scale(1.4)' : 'scale(1)', transition: 'background 0.25s ease, transform 0.25s ease', alignSelf: 'center' }} />
                    ))}
                </div>
                <div style={{ position: 'fixed', right: 24, bottom: 24, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 400, color: '#fff', letterSpacing: '0.08em', zIndex: 9999, pointerEvents: 'none' }}>
                    {String(currentSlide + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
                </div>
            </>,
            document.body
        )}

        </>
    )
}

export default VoiceUX
