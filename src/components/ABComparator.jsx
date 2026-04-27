// ─────────────────────────────────────────────────────────
// ABComparator.jsx — Comparateur de deux prompts côte à côte
//
// Permet de tester deux versions d'un prompt simultanément
// et de comparer leurs outputs en temps réel.
// Le bouton "Copy A → B" permet de partir d'une base commune.
//
// Props :
//   apiKey → clé API Groq de l'utilisateur
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { callGroq } from '../lib/groq'


export default function ABComparator({ apiKey }) {

  // Prompts saisis dans chaque panneau
  const [promptA, setPromptA] = useState('')
  const [promptB, setPromptB] = useState('')

  // Outputs générés par l'IA pour chaque panneau
  const [outputA, setOutputA] = useState('')
  const [outputB, setOutputB] = useState('')

  // États de chargement indépendants (les deux tournent en parallèle)
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)

  // Message d'erreur global (ex: clé manquante)
  const [error, setError] = useState('')


  // ─── run ──────────────────────────────────────────────
  // Lance un appel Groq en streaming pour un seul panneau (A ou B)
  // Chaque panneau est indépendant — ils peuvent tourner en même temps
  // ──────────────────────────────────────────────────────
  const run = async (prompt, setOutput, setLoading) => {
    if (!prompt.trim()) return
    if (!apiKey) { setError('Add your Groq API key first'); return }

    setError('')
    setLoading(true)
    setOutput('')

    try {
      await callGroq({
        apiKey,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        onChunk: (_, full) => setOutput(full), // Mise à jour en temps réel
      })
    } catch (e) {
      setOutput(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }


  // Lance les deux panneaux simultanément (pas d'await → parallèle)
  const runBoth = () => {
    run(promptA, setOutputA, setLoadingA)
    run(promptB, setOutputB, setLoadingB)
  }

  const isRunning = loadingA || loadingB
  const isEmpty   = !promptA.trim() && !promptB.trim()


  return (
    <div>

      {/* Bannière d'erreur (ex: clé API manquante) */}
      {error && (
        <div className="px-4 py-2 text-xs" style={{ color: 'var(--color-danger)', background: '#fee2e2', borderBottom: '0.5px solid var(--color-border)' }}>
          {error}
        </div>
      )}

      {/* ── Grille A / B ──────────────────────────────── */}
      <div className="grid grid-cols-2" style={{ borderBottom: '0.5px solid var(--color-border)' }}>

        {/* Panneau A */}
        <div style={{ borderRight: '0.5px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
            <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: '#e0e7ff', color: '#3730a3' }}>A</span>
            <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Version A</span>
          </div>
          <textarea
            className="w-full p-4 font-mono text-xs resize-none outline-none"
            style={{ minHeight: 100, background: 'var(--color-surface)', color: 'var(--color-text)', borderBottom: '0.5px solid var(--color-border)' }}
            placeholder="Enter prompt A..."
            value={promptA}
            onChange={e => setPromptA(e.target.value)}
          />
          {/* Zone de sortie A */}
          <div className="p-4 min-h-[100px] text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {loadingA && !outputA
              ? <span className="italic text-xs" style={{ color: 'var(--color-muted)' }}>Generating...</span>
              : outputA
                ? <span className={loadingA ? 'cursor-blink' : ''}>{outputA}</span>
                : <span className="text-xs italic" style={{ color: 'var(--color-muted)' }}>Output will appear here</span>
            }
          </div>
        </div>

        {/* Panneau B */}
        <div>
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
            <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: '#fce7f3', color: '#9d174d' }}>B</span>
            <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Version B</span>
          </div>
          <textarea
            className="w-full p-4 font-mono text-xs resize-none outline-none"
            style={{ minHeight: 100, background: 'var(--color-surface)', color: 'var(--color-text)', borderBottom: '0.5px solid var(--color-border)' }}
            placeholder="Enter prompt B..."
            value={promptB}
            onChange={e => setPromptB(e.target.value)}
          />
          {/* Zone de sortie B */}
          <div className="p-4 min-h-[100px] text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {loadingB && !outputB
              ? <span className="italic text-xs" style={{ color: 'var(--color-muted)' }}>Generating...</span>
              : outputB
                ? <span className={loadingB ? 'cursor-blink' : ''}>{outputB}</span>
                : <span className="text-xs italic" style={{ color: 'var(--color-muted)' }}>Output will appear here</span>
            }
          </div>
        </div>

      </div>

      {/* ── Barre d'actions ───────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Lance les deux prompts en parallèle */}
        <button
          onClick={runBoth}
          disabled={isRunning || isEmpty}
          className="text-xs font-medium px-4 py-2 rounded-lg transition-all"
          style={{
            background:  'var(--color-accent)',
            color:       'var(--color-accent-fg)',
            opacity:     isRunning || isEmpty ? 0.5 : 1,
            cursor:      isRunning || isEmpty ? 'not-allowed' : 'pointer',
            border:      'none',
            fontFamily:  'inherit',
          }}
        >
          {isRunning ? 'Running...' : 'Run both ↗'}
        </button>

        {/* Copie le prompt A dans B pour partir d'une base commune */}
        <button
          onClick={() => { setPromptB(promptA); setOutputB('') }}
          className="text-xs px-3 py-2 rounded-lg transition-all"
          style={{ border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer', background: 'transparent', fontFamily: 'inherit' }}
        >
          Copy A → B
        </button>

        <p className="text-xs ml-auto" style={{ color: 'var(--color-muted)' }}>
          Both prompts run simultaneously
        </p>

      </div>

    </div>
  )
}
