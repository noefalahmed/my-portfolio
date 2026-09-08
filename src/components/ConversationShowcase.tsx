import { useRef, useEffect } from 'react'
import styles from './ConversationShowcase.module.css'

const ConversationShowcase: React.FC<{ bgImage?: string; fullscreen?: boolean }> = ({ bgImage, fullscreen }) => {
    const desktopContainerRef = useRef<HTMLDivElement>(null)
    const desktopIframeRef = useRef<HTMLIFrameElement>(null)
    const mobileContainerRef = useRef<HTMLDivElement>(null)
    const mobileIframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const scaleFrames = () => {
            if (desktopContainerRef.current && desktopIframeRef.current) {
                const scale = desktopContainerRef.current.offsetWidth / 1440
                desktopIframeRef.current.style.transform = `scale(${scale})`
                desktopContainerRef.current.style.height = `${Math.round(860 * scale)}px`
            }
            if (mobileContainerRef.current && mobileIframeRef.current) {
                const scale = mobileContainerRef.current.offsetWidth / 430
                mobileIframeRef.current.style.transform = `scale(${scale})`
                mobileContainerRef.current.style.height = `${Math.round(932 * scale)}px`
            }
        }

        scaleFrames()
        const observer = new ResizeObserver(scaleFrames)
        if (desktopContainerRef.current) observer.observe(desktopContainerRef.current)
        if (mobileContainerRef.current) observer.observe(mobileContainerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            className={styles.showcase}
            style={{
                ...(bgImage && { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }),
                ...(fullscreen && { marginTop: 0, borderRadius: 0, position: 'absolute', inset: 0, width: '100%', height: '100%' }),
            }}
        >
            <div className={styles.ipadWrapper}>
                {/* iPad frame */}
                <div className={styles.ipadFrame}>
                    <div className={styles.ipadScreen}>
                        <div ref={desktopContainerRef} className={styles.desktopIframeContainer}>
                            <iframe
                                ref={desktopIframeRef}
                                className={styles.desktopIframe}
                                src="/leadership-coach/conversation-v2-preview.html"
                                title="Desktop conversation"
                            />
                        </div>
                    </div>
                </div>

                {/* Phone overlay — right side of iPad */}
                <div className={styles.phoneWrapper}>
                    <div className={styles.phoneFrame}>
                        <div className={styles.phoneScreen}>
                            <div ref={mobileContainerRef} className={styles.mobileIframeContainer}>
                                <iframe
                                    ref={mobileIframeRef}
                                    className={styles.mobileIframe}
                                    src="/leadership-coach/mobile-preview.html"
                                    title="Mobile conversation"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.phoneCornerMask} aria-hidden="true" />
                </div>
            </div>
        </div>
    )
}

export default ConversationShowcase
