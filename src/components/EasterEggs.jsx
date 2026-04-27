import React, { useState, useEffect, useRef, useCallback } from 'react'

/* ─────────────────────────────────────────────
   TOAST — petit message qui pop en bas
───────────────────────────────────────────── */
function Toast({ message, emoji, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 400)
    }, 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      zIndex: 9999,
      background: 'var(--color-surface)',
      border: '0.5px solid var(--color-border)',
      borderRadius: 12,
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13,
      fontFamily: 'Syne, sans-serif',
      color: 'var(--color-text)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span>{message}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CONFIRM MODAL — confirmation avant action
───────────────────────────────────────────── */
function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, isDark }) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div style={{
        background: 'var(--color-surface)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 14,
        padding: '24px',
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        fontFamily: 'Syne, sans-serif',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{isDark ? '🌙' : '☀️'}</span>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{title}</p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            onClick={onCancel}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: '0.5px solid var(--color-border)', background: 'transparent',
              color: 'var(--color-muted)', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{cancelLabel}</button>
          <button
            onClick={onConfirm}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: 'none', background: 'var(--color-accent)',
              color: 'var(--color-accent-fg)', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{confirmLabel}</button>
        </div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FLASH OVERLAY — pour le mode clair/sombre
───────────────────────────────────────────── */
function FlashOverlay({ type, onDone }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 50)
    const t2 = setTimeout(() => setPhase('exit'), 600)
    const t3 = setTimeout(onDone, 1000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const bg = type === 'blind' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.92)'
  const opacity = phase === 'enter' ? 0 : phase === 'hold' ? 1 : 0

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: bg,
      opacity,
      transition: phase === 'enter' ? 'opacity 0.05s' : 'opacity 0.5s ease',
      pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {phase === 'hold' && (
        <div style={{
          fontSize: 32,
          animation: 'shake 0.4s ease',
          color: type === 'blind' ? '#1a1a18' : '#f0ede8',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          {type === 'blind' ? '☀️' : '🌙'}
        </div>
      )}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-8px) rotate(-1deg) }
          40% { transform: translateX(8px) rotate(1deg) }
          60% { transform: translateX(-5px) }
          80% { transform: translateX(5px) }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────
   KONAMI SECRET SCREEN
───────────────────────────────────────────── */
function KonamiScreen({ onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 600) }, 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      background: 'rgba(0,0,0,0.96)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      <div style={{ fontSize: 64, animation: 'spin 2s linear infinite' }}>⚔</div>
      <div style={{ fontFamily: 'Syne, sans-serif', color: '#f0ede8', fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>MASAMUNE MODE</div>
      <div style={{ fontFamily: 'DM Mono, monospace', color: '#888', fontSize: 12, letterSpacing: 4 }}>UNLOCKED</div>
      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
        {['↑','↑','↓','↓','←','→','←','→','B','A'].map((k, i) => (
          <span key={i} style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(255,255,255,0.08)', color: '#f0ede8', fontFamily: 'DM Mono, monospace', border: '0.5px solid rgba(255,255,255,0.15)' }}>{k}</span>
        ))}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────
   HOOK PRINCIPAL
───────────────────────────────────────────── */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export function useEasterEggs({ darkMode, setDarkMode, lang, prompt }) {
  const [toast, setToast] = useState(null)
  const [flash, setFlash] = useState(null)
  const [konami, setKonami] = useState(false)
  const [confirmDark, setConfirmDark] = useState(false)
  const logoClicksRef = useRef(0)
  const logoTimerRef = useRef(null)
  const konamiBufferRef = useRef([])

  const showToast = useCallback((message, emoji) => {
    setToast({ message, emoji, id: Date.now() })
  }, [])

  const msgs = {
    toLight: {
      en: "You're about to be blinded!",
      fr: "Tu vas être aveuglé !",
      de: "Du wirst geblendet!",
    },
    toDark: {
      en: "Switching to Night Mode",
      fr: "Passage en mode nuit",
      de: "Wechsel in den Nachtmodus",
    },
    confirmToLight: {
      title: { en: 'Switch to Light Mode?', fr: 'Passer en mode clair ?', de: 'Zum hellen Modus wechseln?' },
      message: { en: "Warning — this will be bright. Your eyes might not forgive you.", fr: "Attention — ça va être lumineux. Tes yeux pourraient ne pas te pardonner.", de: "Vorsicht — das wird hell. Deine Augen könnten es dir nicht verzeihen." },
      confirm: { en: 'Blind me', fr: "Aveugle-moi", de: 'Blende mich' },
      cancel: { en: 'Stay in the dark', fr: 'Rester dans le noir', de: 'Im Dunkeln bleiben' },
    },
    confirmToDark: {
      title: { en: 'Switch to Dark Mode?', fr: 'Passer en mode sombre ?', de: 'Zum dunklen Modus wechseln?' },
      message: { en: "You're about to enter the shadows. Ready, Samurai?", fr: "Tu t'apprêtes à entrer dans l'ombre. Prêt, Samouraï ?", de: "Du betrittst die Dunkelheit. Bereit, Samurai?" },
      confirm: { en: 'Enter the dark', fr: "Entrer dans l'ombre", de: 'In die Dunkelheit' },
      cancel: { en: 'Stay in the light', fr: 'Rester dans la lumière', de: 'Im Licht bleiben' },
    },
    emptyPrompt: {
      en: ["The blade cannot cut air, Samurai.", "Even Masamune needs words to forge.", "A prompt without intent is a sword without edge."],
      fr: ["La lame ne peut couper l'air, Samouraï.", "Même Masamune a besoin de mots pour forger.", "Un prompt sans intention est une lame sans tranchant."],
      de: ["Die Klinge kann die Luft nicht schneiden, Samurai.", "Sogar Masamune braucht Worte zum Schmieden.", "Ein Prompt ohne Absicht ist ein Schwert ohne Schneide."],
    },
    logoProgression: {
      en: ["Once...", "Twice...", "Three times...", "Almost there...", "The master blacksmith awakens! 🔥"],
      fr: ["Une fois...", "Deux fois...", "Trois fois...", "Presque...", "Le maître forgeron s'éveille ! 🔥"],
      de: ["Einmal...", "Zweimal...", "Dreimal...", "Fast...", "Der Meisterschmied erwacht! 🔥"],
    },
  }

  const l = lang || 'en'

  // Confirmation avant changement de mode
  const handleDarkModeToggle = useCallback(() => {
    setConfirmDark(true)
  }, [])

  const handleConfirmDarkMode = useCallback(() => {
    setConfirmDark(false)
    const goingLight = darkMode
    const type = goingLight ? 'blind' : 'dark'
    const msg = goingLight ? msgs.toLight[l] : msgs.toDark[l]
    showToast(msg, goingLight ? '☀️' : '🌙')
    setFlash(type)
    setTimeout(() => setDarkMode(d => !d), 150)
  }, [darkMode, l])

  // Logo click counter
  const handleLogoClick = useCallback(() => {
    logoClicksRef.current += 1
    clearTimeout(logoTimerRef.current)
    const clicks = logoClicksRef.current
    const progression = msgs.logoProgression[l]
    if (clicks < 5) {
      showToast(progression[clicks - 1], '⚔')
      logoTimerRef.current = setTimeout(() => { logoClicksRef.current = 0 }, 2000)
    } else {
      logoClicksRef.current = 0
      showToast(progression[4], '🔥')
    }
  }, [l])

  // Empty prompt sarcasm
  const handleEmptyPrompt = useCallback(() => {
    const options = msgs.emptyPrompt[l]
    const msg = options[Math.floor(Math.random() * options.length)]
    showToast(msg, '⚔')
  }, [l])

  // Konami code listener
  useEffect(() => {
    const handler = (e) => {
      konamiBufferRef.current = [...konamiBufferRef.current, e.key].slice(-10)
      if (konamiBufferRef.current.join(',') === KONAMI.join(',')) {
        setKonami(true)
        konamiBufferRef.current = []
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Confirmation avant de quitter la page
  useEffect(() => {
    const handler = (e) => {
      if (prompt && prompt.trim().length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [prompt])

  const isDarkConfirm = darkMode
  const confirmData = isDarkConfirm ? msgs.confirmToLight : msgs.confirmToDark

  const EasterEggPortal = useCallback(() => (
    <>
      {toast && <Toast key={toast.id} message={toast.message} emoji={toast.emoji} onDone={() => setToast(null)} />}
      {flash && <FlashOverlay type={flash} onDone={() => setFlash(null)} />}
      {konami && <KonamiScreen onDone={() => setKonami(false)} />}
      <ConfirmModal
        open={confirmDark}
        isDark={isDarkConfirm}
        title={confirmData.title[l]}
        message={confirmData.message[l]}
        confirmLabel={confirmData.confirm[l]}
        cancelLabel={confirmData.cancel[l]}
        onConfirm={handleConfirmDarkMode}
        onCancel={() => setConfirmDark(false)}
      />
    </>
  ), [toast, flash, konami, confirmDark, l])

  return { handleDarkModeToggle, handleLogoClick, handleEmptyPrompt, EasterEggPortal }
}

