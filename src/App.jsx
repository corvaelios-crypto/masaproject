// ─────────────────────────────────────────────────────────
// App.jsx — Composant racine de Masamune AI
//
// Gère :
//   - La navigation entre les 4 onglets
//   - Le state global (prompt, output, score, clé API, langue, dark mode)
//   - Les appels à l'API Groq (run + analyze)
//   - L'initialisation des hooks (versions, easter eggs)
//
// Structure de l'interface :
//   ┌─────────────────────────────────────┐
//   │  Topbar (logo, tabs, langue, mode)  │
//   ├──────────┬──────────────────────────┤
//   │ Sidebar  │  Main (onglet actif)     │
//   │ Templates│  Playground / Compare /  │
//   │ Versions │  Library / Changelog     │
//   └──────────┴──────────────────────────┘
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

import Sidebar       from './components/Sidebar'
import ScorePanel    from './components/ScorePanel'
import ABComparator  from './components/ABComparator'
import ApiKeyModal   from './components/ApiKeyModal'
import ChangelogTab  from './components/ChangelogTab'

import { callGroq, scorePrompt } from './lib/groq'
import { useVersions }           from './hooks/useVersions'
import { useEasterEggs }         from './components/EasterEggs'
import { TEMPLATES }             from './data/templates'
import { T, LANGUAGES }          from './data/i18n'


// Onglets disponibles dans la topbar
const TABS = ['playground', 'compare', 'library', 'changelog']


export default function App() {

  // ── Navigation ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('playground')

  // ── Playground ──────────────────────────────────────────
  const [prompt,        setPrompt]        = useState('')   // Contenu du textarea
  const [output,        setOutput]        = useState('')   // Réponse de l'IA
  const [streaming,     setStreaming]     = useState(false) // True pendant la génération
  const [score,         setScore]         = useState(null) // Résultat de l'analyse qualité
  const [scoringLoading,setScoringLoading]= useState(false) // True pendant l'analyse
  const [error,         setError]         = useState('')   // Message d'erreur affiché

  // ── Paramètres utilisateur ──────────────────────────────
  // Persistés dans localStorage pour être restaurés à la prochaine visite
  const [apiKey,      setApiKey]      = useState(() => localStorage.getItem('pf_groq_key') || '')
  const [lang,        setLang]        = useState(() => localStorage.getItem('pf_lang')     || 'en')
  const [darkMode,    setDarkMode]    = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  // ── UI state ────────────────────────────────────────────
  const [showApiModal, setShowApiModal] = useState(false) // Modale de saisie de clé API
  const [showLangMenu, setShowLangMenu] = useState(false) // Dropdown de sélection de langue

  // ── Refs ────────────────────────────────────────────────
  const outputRef  = useRef(null) // Pour auto-scroller l'output pendant le streaming
  const langMenuRef= useRef(null) // Pour détecter les clics en dehors du menu langue

  // ── Hooks ───────────────────────────────────────────────
  const t = T[lang] || T.en // Traductions actives selon la langue choisie

  const { versions, currentVersion, saveVersion, switchVersion } = useVersions('')

  const { handleDarkModeToggle, handleLogoClick, handleEmptyPrompt, EasterEggPortal } =
    useEasterEggs({ darkMode, setDarkMode, lang, prompt })

  // Langue active avec son drapeau
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]


  // ── Effets de synchronisation ───────────────────────────

  // Applique la classe "dark" sur <html> quand le mode change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Sauvegarde la clé API dans localStorage
  useEffect(() => {
    if (apiKey) localStorage.setItem('pf_groq_key', apiKey)
  }, [apiKey])

  // Sauvegarde la langue dans localStorage
  useEffect(() => {
    localStorage.setItem('pf_lang', lang)
  }, [lang])

  // Charge le prompt de la version sélectionnée dans le textarea
  useEffect(() => {
    if (currentVersion) setPrompt(currentVersion.prompt)
  }, [currentVersion?.id])

  // Ferme le menu langue si on clique en dehors
  useEffect(() => {
    const handler = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])


  // ── Handlers du Playground ──────────────────────────────

  // Lance la génération en streaming via Groq
  const handleRun = useCallback(async () => {
    if (!prompt.trim()) { handleEmptyPrompt(); return } // Easter egg si prompt vide
    if (!apiKey)        { setShowApiModal(true); return }

    setError('')
    setOutput('')
    setStreaming(true)

    try {
      await callGroq({
        apiKey,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        onChunk: (_, full) => {
          setOutput(full)
          // Auto-scroll vers le bas pendant que le texte arrive
          outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
        },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setStreaming(false)
    }
  }, [prompt, apiKey])


  // Lance l'analyse qualité du prompt via scorePrompt()
  const handleAnalyze = useCallback(async () => {
    if (!prompt.trim()) return
    if (!apiKey) { setShowApiModal(true); return }

    setScoringLoading(true)
    setScore(null)

    try {
      const result = await scorePrompt(apiKey, prompt)
      setScore(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setScoringLoading(false)
    }
  }, [prompt, apiKey])


  // Raccourci clavier Ctrl+Enter / Cmd+Enter pour lancer
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
    }
  }


  // ────────────────────────────────────────────────────────
  // RENDU
  // ────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* ══════════════════════════════════════════════════
          TOPBAR — Logo, Tabs, Langue, Dark mode, Clé API
      ══════════════════════════════════════════════════ */}
      <header
        className="flex items-center gap-4 px-5 h-14 flex-shrink-0"
        style={{ background: 'var(--color-surface)', borderBottom: '0.5px solid var(--color-border)' }}
      >

        {/* Logo — cliquable (easter egg secret à 5 clics) */}
        <div
          className="flex items-center gap-2 select-none cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-base" style={{ background: 'var(--color-accent)' }}>
            ⚔
          </div>
          <div className="font-bold text-sm tracking-tight">{t.appName}</div>
        </div>

        {/* Navigation principale */}
        <nav className="flex items-center gap-1 ml-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background:  activeTab === tab ? 'var(--color-bg)'     : 'transparent',
                color:       activeTab === tab ? 'var(--color-text)'   : 'var(--color-muted)',
                border:      activeTab === tab ? '0.5px solid var(--color-border)' : '0.5px solid transparent',
                cursor:      'pointer',
                fontFamily:  'inherit',
              }}
            >
              {t.tabs[tab]}
              {/* Badge "NEW" uniquement sur l'onglet Changelog */}
              {tab === 'changelog' && (
                <span className="ml-1.5 px-1 rounded font-bold" style={{ background: '#fce7f3', color: '#9d174d', fontSize: 10 }}>
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Actions à droite : langue, dark mode, clé API */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Sélecteur de langue (dropdown) */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <span style={{ color: 'var(--color-muted)', fontSize: 9 }}>▼</span>
            </button>

            {showLangMenu && (
              <div
                className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50"
                style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', minWidth: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              >
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangMenu(false) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs transition-all"
                    style={{
                      background:  lang === l.code ? 'var(--color-bg)' : 'transparent',
                      color:       lang === l.code ? 'var(--color-text)' : 'var(--color-muted)',
                      border:      'none',
                      cursor:      'pointer',
                      fontFamily:  'inherit',
                      fontWeight:  lang === l.code ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'var(--color-bg)' }}
                    onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton dark/light mode — avec confirmation + animation (easter egg) */}
          <button
            onClick={handleDarkModeToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)', cursor: 'pointer' }}
            title={t.topbar.darkMode}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Bouton clé API — point vert si connecté, rouge sinon */}
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: apiKey ? 'var(--color-success)' : 'var(--color-danger)' }} />
            {apiKey ? t.topbar.connected : t.topbar.addKey}
          </button>

        </div>
      </header>


      {/* ══════════════════════════════════════════════════
          BODY — Sidebar + Contenu principal
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar cachée sur l'onglet Changelog (pas utile là-bas) */}
        {activeTab !== 'changelog' && (
          <div className="w-52 flex-shrink-0 flex flex-col">
            <Sidebar
              versions={versions}
              currentVersionId={currentVersion?.id}
              onSwitchVersion={switchVersion}
              onLoadTemplate={(tmpl) => { setPrompt(tmpl); setOutput(''); setScore(null) }}
              activeTab={activeTab}
              t={t}
            />
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-hidden flex flex-col">


          {/* ════════════════════════════════════════════
              ONGLET : PLAYGROUND
              Zone d'écriture, de génération et de scoring
          ════════════════════════════════════════════ */}
          {activeTab === 'playground' && (
            <div className="flex flex-1 min-h-0">

              {/* Colonne gauche : éditeur de prompt + output */}
              <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

                {/* Zone d'écriture du prompt */}
                <div style={{ borderBottom: '0.5px solid var(--color-border)' }}>
                  <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                      {t.playground.promptLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Compteur de caractères */}
                      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {prompt.length} {t.playground.chars}
                      </span>
                      {/* Sauvegarde la version actuelle dans l'historique */}
                      <button
                        onClick={() => { if (prompt.trim()) saveVersion(prompt) }}
                        className="text-xs px-2.5 py-1 rounded-md transition-all"
                        style={{ border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer', background: 'transparent', fontFamily: 'inherit' }}
                      >
                        {t.playground.saveVersion}
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="w-full font-mono text-sm p-4 outline-none resize-none"
                    style={{ minHeight: 160, background: 'var(--color-surface)', color: 'var(--color-text)', border: 'none' }}
                    placeholder={t.playground.placeholder}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Barre d'actions */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{ borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-surface)' }}
                >
                  {/* Bouton principal : lancer la génération */}
                  <button
                    onClick={handleRun}
                    disabled={streaming}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background:  'var(--color-accent)',
                      color:       'var(--color-accent-fg)',
                      border:      'none',
                      cursor:      streaming ? 'not-allowed' : 'pointer',
                      opacity:     streaming ? 0.5 : 1,
                      fontFamily:  'inherit',
                    }}
                  >
                    {streaming ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        {t.playground.generating}
                      </>
                    ) : t.playground.run}
                  </button>

                  {/* Bouton secondaire : analyser la qualité du prompt */}
                  <button
                    onClick={handleAnalyze}
                    disabled={scoringLoading || !prompt.trim()}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      border:      '0.5px solid var(--color-border)',
                      color:       'var(--color-text)',
                      cursor:      scoringLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
                      opacity:     scoringLoading || !prompt.trim() ? 0.5 : 1,
                      background:  'transparent',
                      fontFamily:  'inherit',
                    }}
                  >
                    {scoringLoading ? t.playground.analyzing : t.playground.analyze}
                  </button>

                  {/* Effacer tout */}
                  <button
                    onClick={() => { setPrompt(''); setOutput(''); setScore(null); setError('') }}
                    className="px-3 py-2 rounded-lg text-xs transition-all"
                    style={{ border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer', background: 'transparent', fontFamily: 'inherit' }}
                  >
                    {t.playground.clear}
                  </button>

                  {/* Message d'erreur (ex: clé invalide, timeout) */}
                  {error && (
                    <span className="text-xs ml-auto" style={{ color: 'var(--color-danger)' }}>
                      ⚠ {error}
                    </span>
                  )}
                </div>

                {/* Zone d'output — rendu Markdown pour afficher gras, listes, code, etc. */}
                <div ref={outputRef} className="flex-1 overflow-y-auto scrollbar-thin p-4">
                  {output ? (
                    <div className={`markdown-output ${streaming ? 'cursor-blink' : ''}`} style={{ color: 'var(--color-text)' }}>
                      <ReactMarkdown>{output}</ReactMarkdown>
                    </div>
                  ) : (
                    // État vide — invite à écrire un prompt
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center" style={{ color: 'var(--color-muted)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ border: '0.5px solid var(--color-border)' }}>
                        ⚔
                      </div>
                      <p className="text-sm">{t.playground.outputPlaceholder}</p>
                      <p className="text-xs">{t.playground.outputHint}</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Colonne droite : Score de qualité du prompt */}
              <div
                className="w-64 flex-shrink-0 overflow-y-auto scrollbar-thin"
                style={{ borderLeft: '0.5px solid var(--color-border)', background: 'var(--color-surface)' }}
              >
                <div className="px-4 py-2.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                    {t.playground.qualityScore}
                  </span>
                </div>
                <ScorePanel score={score} loading={scoringLoading} />
              </div>

            </div>
          )}


          {/* ════════════════════════════════════════════
              ONGLET : COMPARE A/B
              Deux prompts côte à côte, lancés en parallèle
          ════════════════════════════════════════════ */}
          {activeTab === 'compare' && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2.5" style={{ borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                  {t.compare.subtitle}
                </span>
              </div>
              <div style={{ background: 'var(--color-surface)' }}>
                <ABComparator apiKey={apiKey} />
              </div>
            </div>
          )}


          {/* ════════════════════════════════════════════
              ONGLET : LIBRARY
              Grille de templates cliquables
          ════════════════════════════════════════════ */}
          {activeTab === 'library' && (
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-lg font-semibold mb-1">{t.library.title}</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>{t.library.subtitle}</p>

              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    // Charge le template et redirige vers le Playground
                    onClick={() => {
                      setActiveTab('playground')
                      setTimeout(() => { setPrompt(tmpl.prompt); setOutput(''); setScore(null) }, 50)
                    }}
                    className="flex flex-col gap-2 p-4 rounded-xl text-left transition-all"
                    style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-muted)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tmpl.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{tmpl.label}</p>
                        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{tmpl.category}</p>
                      </div>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--color-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {tmpl.prompt.slice(0, 80)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* ════════════════════════════════════════════
              ONGLET : CHANGELOG
              Timeline des versions et patch notes
          ════════════════════════════════════════════ */}
          {activeTab === 'changelog' && <ChangelogTab />}


        </main>
      </div>


      {/* ── Modales et overlays ─────────────────────────── */}

      {/* Modale de saisie de la clé API Groq */}
      <ApiKeyModal
        open={showApiModal}
        onSave={setApiKey}
        onClose={() => setShowApiModal(false)}
        currentKey={apiKey}
        t={t.apiModal}
      />

      {/* Easter Eggs : toasts, flash, konami screen, modale de confirmation */}
      <EasterEggPortal />

    </div>
  )
}
