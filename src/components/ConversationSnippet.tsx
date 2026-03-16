import React, { useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import styles from './ConversationSnippet.module.css'

type MessageSide = 'me' | 'drew'

interface Message {
  id: string
  side: MessageSide
  text: string
  audioSrc: string
}

const MESSAGES: Message[] = [
  {
    id: 'me-1',
    side: 'me',
    text: "Hey Drew, I wanted to talk about the project. The workload hasn't been split evenly and it held up the whole team.",
    audioSrc: '/assets/sc-audio-me-1.m4a',
  },
  {
    id: 'drew-1',
    side: 'drew',
    text: "Hi. I mean, I've been swamped. Everyone has stuff going on — it's not like I disappeared on purpose.",
    audioSrc: '/assets/sc-audio-drew-1.mp3',
  },
  {
    id: 'me-2',
    side: 'me',
    text: 'I know, but we needed your branch merged before the build and we had to work around it last minute.',
    audioSrc: '/assets/sc-audio-me-2.m4a',
  },
  {
    id: 'drew-2a',
    side: 'drew',
    text: "I told you I was behind. I don't really know what you want me to say — it happened, it's done.",
    audioSrc: '/assets/sc-audio-drew-2a.mp3',
  },
  {
    id: 'drew-2b',
    side: 'drew',
    text: "And honestly, it feels like you're making this a bigger deal than it is.",
    audioSrc: '/assets/sc-audio-drew-2b.mp3',
  },
]

const ConversationSnippet: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  const getAudio = (msg: Message): HTMLAudioElement => {
    if (!audioRefs.current[msg.id]) {
      const audio = new Audio(msg.audioSrc)
      audio.preload = 'auto'
      audio.addEventListener('ended', () => {
        setPlayingId(prev => (prev === msg.id ? null : prev))
      })
      audioRefs.current[msg.id] = audio
    }
    return audioRefs.current[msg.id]
  }

  const handlePlay = (msg: Message) => {
    if (playingId === msg.id) {
      getAudio(msg).pause()
      setPlayingId(null)
    } else {
      if (playingId) {
        const current = audioRefs.current[playingId]
        if (current) current.pause()
      }
      const audio = getAudio(msg)
      audio.currentTime = 0
      audio.play()
      setPlayingId(msg.id)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        {MESSAGES.map(msg => {
          const isPlaying = playingId === msg.id
          const isMe = msg.side === 'me'

          return (
            <div
              key={msg.id}
              className={`${styles.row} ${isMe ? styles.rowMe : styles.rowDrew}`}
            >
              {/* Drew layout: play button → avatar → bubble */}
              {!isMe && (
                <>
                  <button
                    className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
                    onClick={() => handlePlay(msg)}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={18} color="#fff" /> : <Play size={18} color="#fff" />}
                  </button>
                  <img
                    src="/assets/sc-avatar-drew.png"
                    alt="Drew"
                    className={styles.avatar}
                  />
                </>
              )}

              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${isMe ? styles.labelMe : styles.labelDrew}`}>
                  {isMe ? 'Me' : 'Drew'}
                </span>
                <div
                  className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleDrew} ${isPlaying ? styles.bubbleActive : ''}`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Me layout: bubble → avatar → play button */}
              {isMe && (
                <>
                  <img
                    src="/assets/sc-avatar-me.png"
                    alt="Me"
                    className={styles.avatar}
                  />
                  <button
                    className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
                    onClick={() => handlePlay(msg)}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={18} color="#fff" /> : <Play size={18} color="#fff" />}
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
      <p className={styles.disclaimer}>Drew is an AI Agent</p>
    </div>
  )
}

export default ConversationSnippet
