// ─────────────────────────────────────────────────────────
// Sidebar.jsx — Panneau latéral gauche
//
// Contient deux sections :
//   1. Templates  → filtrés par catégorie, cliquables pour charger dans le Playground
//   2. Versions   → historique des prompts sauvegardés (uniquement sur l'onglet Playground)
//
// Props :
//   versions         → liste des versions sauvegardées (depuis useVersions)
//   currentVersionId → ID de la version active
//   onSwitchVersion  → callback pour changer de version
//   onLoadTemplate   → callback pour charger un template dans le Playground
//   activeTab        → onglet actif (cache les templates sur "compare")
//   t                → traductions (i18n)
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { TEMPLATES, CATEGORIES } from '../data/templates'


export default function Sidebar({ versions, currentVersionId, onSwitchVersion, onLoadTemplate, activeTab, t }) {

  // Fallback si les traductions ne sont pas encore chargées
  const sidebar = t?.sidebar || { templates: 'Templates', versions: 'Versions' }

  // Catégorie sélectionnée dans le filtre
  const [category, setCategory] = useState('All')

  // Templates filtrés selon la catégorie active
  const filtered = TEMPLATES.filter(tmpl => category === 'All' || tmpl.category === category)


  return (
    <aside
      className="flex flex-col h-full overflow-y-auto scrollbar-thin"
      style={{ background: 'var(--color-surface)', borderRight: '0.5px solid var(--color-border)' }}
    >

      {/* ── Section Templates ────────────────────────────
          Cachée sur l'onglet Compare (pas pertinent là-bas)
      ─────────────────────────────────────────────────── */}
      {activeTab !== 'compare' && (
        <div className="p-3 flex-1">

          <p className="text-xs font-medium uppercase tracking-wider px-2 mb-2" style={{ color: 'var(--color-muted)' }}>
            {sidebar.templates}
          </p>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-1 mb-3 px-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="text-xs px-2 py-1 rounded-md transition-all"
                style={{
                  background:   category === c ? 'var(--color-accent)' : 'transparent',
                  color:        category === c ? 'var(--color-accent-fg)' : 'var(--color-muted)',
                  border:       '0.5px solid',
                  borderColor:  category === c ? 'var(--color-accent)' : 'var(--color-border)',
                  cursor:       'pointer',
                  fontFamily:   'inherit',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Liste des templates filtrés */}
          <div className="space-y-1">
            {filtered.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => onLoadTemplate(tmpl.prompt)}
                className="flex items-center gap-2.5 w-full text-left px-2 py-2 rounded-lg transition-all"
                style={{ background: 'transparent', color: 'var(--color-text)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="text-base">{tmpl.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{tmpl.label}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{tmpl.category}</p>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* ── Section Versions ─────────────────────────────
          Visible uniquement sur l'onglet Playground
          Affiche les versions sauvegardées, la plus récente en premier
      ─────────────────────────────────────────────────── */}
      {activeTab === 'playground' && versions.length > 0 && (
        <div className="p-3" style={{ borderTop: '0.5px solid var(--color-border)' }}>

          <p className="text-xs font-medium uppercase tracking-wider px-2 mb-2" style={{ color: 'var(--color-muted)' }}>
            {sidebar.versions}
          </p>

          <div className="space-y-1">
            {[...versions].reverse().map(v => (
              <button
                key={v.id}
                onClick={() => onSwitchVersion(v.id)}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg transition-all text-xs"
                style={{
                  background: v.id === currentVersionId ? 'var(--color-bg)' : 'transparent',
                  color:      v.id === currentVersionId ? 'var(--color-text)' : 'var(--color-muted)',
                  border:     'none',
                  cursor:     'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {/* Indicateur vert = version active */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: v.id === currentVersionId ? 'var(--color-success)' : 'var(--color-border)' }}
                />
                <span className="font-mono">{v.label}</span>
                <span className="ml-auto" style={{ color: 'var(--color-muted)' }}>
                  {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </button>
            ))}
          </div>

        </div>
      )}

    </aside>
  )
}
