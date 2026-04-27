// ─────────────────────────────────────────────────────────
// useVersions.js — Hook de gestion de l'historique de prompts
//
// Permet à l'utilisateur de sauvegarder jusqu'à MAX_VERSIONS
// versions différentes de son prompt et d'y revenir.
// ─────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'

// Nombre maximum de versions conservées en mémoire
const MAX_VERSIONS = 10


export function useVersions(initialPrompt = '') {

  // Liste de toutes les versions sauvegardées
  const [versions, setVersions] = useState([
    {
      id: 1,
      prompt: initialPrompt,
      label: 'v1',
      createdAt: new Date().toISOString(),
    },
  ])

  // ID de la version actuellement sélectionnée
  const [currentVersionId, setCurrentVersionId] = useState(1)

  // Version active dérivée de l'ID courant
  const currentVersion = versions.find(v => v.id === currentVersionId)


  // ─── saveVersion ──────────────────────────────────────
  // Crée une nouvelle version avec le prompt actuel
  // et la définit comme version courante.
  // Si on dépasse MAX_VERSIONS, la plus ancienne est supprimée.
  // ──────────────────────────────────────────────────────
  const saveVersion = useCallback((prompt) => {
    setVersions(prev => {
      const nextId = prev.length + 1
      const newVersion = {
        id: nextId,
        prompt,
        label: `v${nextId}`,
        createdAt: new Date().toISOString(),
      }

      const updated = [...prev, newVersion].slice(-MAX_VERSIONS)
      setCurrentVersionId(newVersion.id)
      return updated
    })
  }, [])


  // ─── switchVersion ────────────────────────────────────
  // Change la version active par son ID
  // ──────────────────────────────────────────────────────
  const switchVersion = useCallback((id) => {
    setCurrentVersionId(id)
  }, [])


  return { versions, currentVersion, saveVersion, switchVersion }
}
