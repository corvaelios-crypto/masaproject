export const CHANGELOG = [
  {
    version: '1.4.1',
    date: '2026-04-27',
    tag: 'fix',
    title: 'Correction de bug',
    changes: [
      { type: 'fix', text: 'Rendu Markdown — l\'output n\'affiche plus la syntaxe brute comme ***gras*** ou **texte**' },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-04-27',
    tag: 'feature',
    title: 'Confirmations & polish',
    changes: [
      { type: 'new', text: 'Modale de confirmation avant chaque changement de mode clair/sombre' },
      { type: 'new', text: 'Avertissement natif du navigateur si tu quittes la page avec un prompt en cours' },
      { type: 'new', text: 'Onglet du navigateur renommé Masamune.AI' },
      { type: 'fix', text: 'Suppression du sous-titre "Forgeron de Katana" dans le logo' },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-04-26',
    tag: 'feature',
    title: 'Identité Masamune AI',
    changes: [
      { type: 'new', text: 'System prompt intégré — Masamune AI se présente comme lui-même et non comme LLaMA' },
      { type: 'fix', text: 'L\'analyseur de score utilise son propre contexte, sans conflit avec l\'identité principale' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-04-25',
    tag: 'feature',
    title: 'Easter Eggs',
    changes: [
      { type: 'new', text: 'Animation flash + toast lors du changement de mode clair/sombre' },
      { type: 'new', text: 'Easter egg logo — clique 5 fois sur ⚔ pour déclencher la progression secrète' },
      { type: 'new', text: 'Message sarcastique de Masamune si tu lances un prompt vide' },
      { type: 'new', text: 'Konami Code (↑↑↓↓←→←→BA) — débloque le MASAMUNE MODE' },
      { type: 'new', text: 'Tous les messages d\'easter egg traduits en FR / EN / DE' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-04-25',
    tag: 'feature',
    title: 'Support multilingue & rebranding',
    changes: [
      { type: 'new', text: 'Support de la langue française (FR) sur toute l\'interface' },
      { type: 'new', text: 'Support de la langue allemande (DE) sur toute l\'interface' },
      { type: 'new', text: 'Sélecteur de langue dans la topbar — EN / FR / DE' },
      { type: 'new', text: 'Cet onglet Patch Notes — tu es en train de le lire 👋' },
      { type: 'rebrand', text: 'PromptForge devient Masamune AI' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-25',
    tag: 'release',
    title: 'Version initiale',
    changes: [
      { type: 'new', text: 'Playground avec streaming temps réel via l\'API Groq' },
      { type: 'new', text: 'Score de qualité IA — clarté, spécificité, structure, risque d\'hallucination' },
      { type: 'new', text: 'Comparateur A/B — deux prompts en parallèle simultanément' },
      { type: 'new', text: 'Bibliothèque de 6 templates prêts à l\'emploi' },
      { type: 'new', text: 'Historique de versions — sauvegarder et naviguer entre les itérations' },
      { type: 'new', text: 'Mode sombre / clair avec détection de la préférence système' },
      { type: 'new', text: 'Clé API Groq stockée dans le localStorage' },
    ],
  },
]
