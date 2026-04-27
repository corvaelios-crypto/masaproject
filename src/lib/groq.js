// ─────────────────────────────────────────────────────────
// groq.js — Client API pour Groq
//
// Ce fichier gère toutes les communications avec l'API Groq.
// Il expose deux fonctions :
//   - callGroq()    → appel général, avec ou sans streaming
//   - scorePrompt() → analyse la qualité d'un prompt via l'IA
// ─────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Identité de Masamune AI — injectée dans chaque requête utilisateur
// pour que le modèle réponde toujours en tant que Masamune AI
// et ne mentionne jamais LLaMA, Meta ou Groq
const SYSTEM_PROMPT = `
  You are Masamune AI, a general-purpose AI assistant.
  You were created and built by a developer as part of a portfolio project called Masamune AI.
  Do not mention LLaMA, Meta, Groq, or any underlying model or infrastructure.
  If asked who you are, say you are Masamune AI.
  Be helpful, clear, and concise.
`.trim()


// ─── callGroq ───────────────────────────────────────────
// Fonction principale d'appel à l'API Groq
//
// Paramètres :
//   apiKey          → clé API Groq de l'utilisateur
//   messages        → tableau de messages { role, content }
//   model           → modèle à utiliser (défaut : llama-3.3-70b-versatile)
//   stream          → true = réponse en streaming temps réel
//   onChunk         → callback appelé à chaque morceau de texte reçu (streaming)
//   withSystemPrompt → false = ne pas injecter l'identité Masamune (ex: pour le scoring)
// ────────────────────────────────────────────────────────
export async function callGroq({
  apiKey,
  messages,
  model = 'llama-3.3-70b-versatile',
  stream = false,
  onChunk,
  withSystemPrompt = true,
}) {
  // Prépare les messages : ajoute le system prompt si nécessaire
  const fullMessages = withSystemPrompt
    ? [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
    : messages

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: fullMessages,
      stream,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  // Gestion des erreurs HTTP
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }

  // Mode normal (pas de streaming) → retourne le texte complet directement
  if (!stream) {
    const data = await res.json()
    return data.choices[0].message.content
  }

  // Mode streaming → lit le flux SSE chunk par chunk
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    // Chaque chunk peut contenir plusieurs lignes "data: {...}"
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6) // Retire le préfixe "data: "
      if (data === '[DONE]') continue

      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content || ''

        if (text) {
          full += text
          onChunk?.(text, full) // Notifie le composant parent avec le texte partiel
        }
      } catch {
        // Ignore les lignes malformées
      }
    }
  }

  return full
}


// ─── scorePrompt ────────────────────────────────────────
// Analyse la qualité d'un prompt via l'IA
//
// Retourne un objet JSON avec des scores de 0 à 100 et des suggestions.
// Utilise withSystemPrompt: false pour éviter tout conflit avec l'identité Masamune.
// ────────────────────────────────────────────────────────
export async function scorePrompt(apiKey, prompt) {
  const systemPrompt = `
    You are a prompt quality analyzer.
    Analyze the given prompt and return ONLY a valid JSON object with these exact fields:
    {
      "clarity": <integer 0-100>,
      "specificity": <integer 0-100>,
      "structure": <integer 0-100>,
      "hallucination_risk": <integer 0-100>,
      "overall": <integer 0-100>,
      "suggestions": [
        { "type": "warning|success|info", "text": "<short actionable suggestion>" },
        { "type": "warning|success|info", "text": "<short actionable suggestion>" },
        { "type": "warning|success|info", "text": "<short actionable suggestion>" }
      ]
    }
    Return ONLY the JSON, no markdown, no explanation.
  `.trim()

  const result = await callGroq({
    apiKey,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this prompt:\n\n${prompt}` },
    ],
    stream: false,
    withSystemPrompt: false, // On gère notre propre system prompt ici
  })

  try {
    return JSON.parse(result)
  } catch {
    return null // Retourne null si le JSON est invalide
  }
}
