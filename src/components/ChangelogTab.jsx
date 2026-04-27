// ─────────────────────────────────────────────────────────
// ChangelogTab.jsx — Onglet Patch Notes
//
// Affiche l'historique complet des versions sous forme de timeline.
// Les données viennent de src/data/changelog.js
// La version la plus récente apparaît en haut avec le badge "Latest"
// ─────────────────────────────────────────────────────────

import React from 'react'
import { CHANGELOG } from '../data/changelog'


// ─── Styles des tags de version ───────────────────────
// Correspond au champ "tag" dans changelog.js
// ──────────────────────────────────────────────────────
const TAG_STYLES = {
  release: { bg: '#dbeafe', color: '#1e40af', label: 'Release' },
  feature: { bg: '#d1fae5', color: '#065f46', label: 'Feature' },
  fix:     { bg: '#fef3c7', color: '#92400e', label: 'Fix'     },
}

// ─── Styles des types de changements ──────────────────
// Correspond au champ "type" dans chaque entrée de changes[]
// ──────────────────────────────────────────────────────
const TYPE_STYLES = {
  new:     { icon: '✦', color: 'var(--color-success)' },
  fix:     { icon: '⬡', color: 'var(--color-warning)' },
  rebrand: { icon: '⚔', color: 'var(--color-info)'    },
  remove:  { icon: '✕', color: 'var(--color-danger)'  },
}


export default function ChangelogTab() {
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">

      {/* En-tête de la page */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Patch Notes</h2>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Every update to Masamune AI, documented.
        </p>
      </div>

      {/* ── Timeline ──────────────────────────────────── */}
      <div className="relative">

        {/* Ligne verticale de la timeline */}
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'var(--color-border)' }} />

        <div className="space-y-8">
          {CHANGELOG.map((entry, i) => {
            const tag = TAG_STYLES[entry.tag] || TAG_STYLES.feature
            const isLatest = i === 0 // La première entrée = version la plus récente

            return (
              <div key={entry.version} className="relative pl-10">

                {/* Point de la timeline (★ pour la dernière version, ○ pour les autres) */}
                <div
                  className="absolute left-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isLatest ? 'var(--color-accent)'  : 'var(--color-surface)',
                    border:    `0.5px solid ${isLatest ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    color:      isLatest ? 'var(--color-accent-fg)' : 'var(--color-muted)',
                    top: 2,
                  }}
                >
                  {isLatest ? '★' : '○'}
                </div>

                {/* Carte de version */}
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: 'var(--color-surface)',
                    border: isLatest ? '0.5px solid var(--color-muted)' : '0.5px solid var(--color-border)',
                  }}
                >

                  {/* En-tête de la carte : numéro de version, tag, date */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">

                        {/* Numéro de version */}
                        <span
                          className="text-xs font-bold font-mono px-2 py-0.5 rounded"
                          style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}
                        >
                          v{entry.version}
                        </span>

                        {/* Tag (Release / Feature / Fix) */}
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ background: tag.bg, color: tag.color }}
                        >
                          {tag.label}
                        </span>

                        {/* Badge "Latest" uniquement sur la version la plus récente */}
                        {isLatest && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#fce7f3', color: '#9d174d' }}>
                            Latest
                          </span>
                        )}

                      </div>
                      <h3 className="text-sm font-semibold">{entry.title}</h3>
                    </div>

                    {/* Date de la version */}
                    <span className="text-xs flex-shrink-0 font-mono" style={{ color: 'var(--color-muted)' }}>
                      {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Liste des changements */}
                  <ul className="space-y-2">
                    {entry.changes.map((change, j) => {
                      const style = TYPE_STYLES[change.type] || TYPE_STYLES.new
                      return (
                        <li key={j} className="flex items-start gap-2.5">
                          <span className="flex-shrink-0 text-xs mt-0.5 font-mono" style={{ color: style.color }}>
                            {style.icon}
                          </span>
                          <span className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                            {change.text}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                </div>
              </div>
            )
          })}
        </div>

        {/* Pied de page de la timeline */}
        <div className="pl-10 pt-4">
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>⚔ Masamune AI</p>
        </div>

      </div>
    </div>
  )
}
