// ─────────────────────────────────────────────────────────
// ApiKeyModal.jsx — Modale de saisie de la clé API Groq
//
// S'affiche quand l'utilisateur clique sur "Add API key"
// ou quand il tente de lancer un prompt sans clé configurée.
// La clé est sauvegardée dans le localStorage du navigateur.
//
// Props :
//   open        → booléen d'affichage
//   onSave      → callback appelé avec la clé validée
//   onClose     → callback de fermeture
//   currentKey  → clé actuelle (prérempli dans le champ)
//   t           → traductions (i18n)
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react'


export default function ApiKeyModal({ open, onSave, onClose, currentKey, t: translations }) {

  // Fallback si les traductions ne sont pas encore chargées
  const t = translations || {
    title:       'Connect Groq API',
    desc:        "Your key is stored only in your browser's localStorage.",
    label:       'API Key',
    placeholder: 'gsk_...',
    cancel:      'Cancel',
    save:        'Save key',
    link:        'Get your free Groq API key →',
  }

  // Valeur du champ de saisie
  const [value, setValue] = useState(currentKey || '')


  // Sauvegarde la clé et ferme la modale
  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim())
      onClose()
    }
  }

  // Ne rend rien si la modale est fermée
  if (!open) return null


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }} // Ferme en cliquant l'overlay
    >
      <div
        className="w-96 rounded-xl p-6 space-y-4"
        style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}
      >

        {/* En-tête */}
        <div>
          <h2 className="text-base font-semibold mb-1">{t.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{t.desc}</p>
        </div>

        {/* Champ de saisie de la clé (masqué par défaut) */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>
            {t.label}
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none"
            style={{ background: 'var(--color-bg)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}
            placeholder={t.placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()} // Entrée = valider
            autoFocus
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg transition-all"
            style={{ border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={!value.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              background:  'var(--color-accent)',
              color:       'var(--color-accent-fg)',
              cursor:      value.trim() ? 'pointer' : 'not-allowed',
              opacity:     value.trim() ? 1 : 0.5,
              fontFamily:  'inherit',
              border:      'none',
            }}
          >
            {t.save}
          </button>
        </div>

        {/* Lien vers la console Groq pour obtenir une clé */}
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-center"
          style={{ color: 'var(--color-info)' }}
        >
          {t.link}
        </a>

      </div>
    </div>
  )
}
