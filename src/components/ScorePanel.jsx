// ─────────────────────────────────────────────────────────
// ScorePanel.jsx — Panneau de score de qualité d'un prompt
//
// Affiche 4 métriques sous forme de barres de progression
// et une liste de suggestions générées par l'IA.
//
// Props :
//   score   → objet retourné par scorePrompt() dans groq.js
//   loading → booléen — affiche un skeleton pendant l'analyse
// ─────────────────────────────────────────────────────────

import React from 'react'


// ─── Métriques analysées ──────────────────────────────
// invert: true = une valeur haute est mauvaise (ex: risque d'hallucination)
// ─────────────────────────────────────────────────────
const METRICS = [
  { key: 'clarity',           label: 'Clarity',           color: '#2563eb' },
  { key: 'specificity',       label: 'Specificity',       color: '#16a34a' },
  { key: 'structure',         label: 'Structure',         color: '#9333ea' },
  { key: 'hallucination_risk',label: 'Hallucination risk', color: '#dc2626', invert: true },
]


// ─── ScoreBar ─────────────────────────────────────────
// Barre de progression colorée pour une métrique donnée
// Si invert = true, la couleur passe au rouge quand la valeur monte
// ─────────────────────────────────────────────────────
function ScoreBar({ value, color, invert }) {

  // Pour les métriques inversées, on affiche 100 - valeur (ex: risque 20 = score 80)
  const display = invert ? 100 - value : value

  // Couleur dynamique pour les métriques inversées (vert → orange → rouge)
  const barColor = invert
    ? value > 60 ? '#dc2626' : value > 30 ? '#d97706' : '#16a34a'
    : color

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${display}%`, background: barColor }}
        />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color: 'var(--color-muted)' }}>
        {display}
      </span>
    </div>
  )
}


// ─── ScorePanel ───────────────────────────────────────
// Composant principal — gère 3 états :
//   1. loading → skeleton animé
//   2. vide    → invitation à lancer l'analyse
//   3. score   → affichage complet des métriques + suggestions
// ─────────────────────────────────────────────────────
export default function ScorePanel({ score, loading }) {

  // État 1 : Analyse en cours → skeleton
  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {METRICS.map(m => (
          <div key={m.key} className="space-y-1.5">
            <div className="h-3 rounded w-24" style={{ background: 'var(--color-border)' }} />
            <div className="h-1.5 rounded-full"  style={{ background: 'var(--color-border)' }} />
          </div>
        ))}
      </div>
    )
  }

  // État 2 : Pas encore analysé → état vide
  if (!score) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8" style={{ color: 'var(--color-muted)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
        <p className="text-sm">Run analysis to see score</p>
      </div>
    )
  }

  // État 3 : Score disponible → affichage complet
  return (
    <div className="p-4 space-y-4">

      {/* Score global avec badge de niveau */}
      <div className="flex items-baseline gap-3 pb-3" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <span className="text-4xl font-bold font-mono">{score.overall}</span>
        <span className="text-sm" style={{ color: 'var(--color-muted)' }}>/ 100</span>
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
          style={{
            background: score.overall >= 75 ? '#dcfce7' : score.overall >= 50 ? '#fef9c3' : '#fee2e2',
            color:      score.overall >= 75 ? '#15803d' : score.overall >= 50 ? '#854d0e' : '#991b1b',
          }}
        >
          {score.overall >= 75 ? 'Strong' : score.overall >= 50 ? 'Average' : 'Weak'}
        </span>
      </div>

      {/* Métriques détaillées */}
      <div className="space-y-3">
        {METRICS.map(m => (
          <div key={m.key}>
            <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{m.label}</span>
            <ScoreBar value={score[m.key]} color={m.color} invert={m.invert} />
          </div>
        ))}
      </div>

      {/* Suggestions de l'IA (warning / success / info) */}
      {score.suggestions?.length > 0 && (
        <div className="pt-3 space-y-2" style={{ borderTop: '0.5px solid var(--color-border)' }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
            Suggestions
          </p>
          {score.suggestions.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span
                className="mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                style={{
                  background: s.type === 'warning' ? '#fef3c7' : s.type === 'success' ? '#d1fae5' : '#dbeafe',
                  color:      s.type === 'warning' ? '#92400e' : s.type === 'success' ? '#065f46' : '#1e40af',
                }}
              >
                {s.type === 'warning' ? '!' : s.type === 'success' ? '✓' : 'i'}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{s.text}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
