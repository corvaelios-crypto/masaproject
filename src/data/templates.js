// ─────────────────────────────────────────────────────────
// templates.js — Bibliothèque de prompts prêts à l'emploi
//
// Chaque template est chargé dans le Playground via la Sidebar.
// Le placeholder {{input}} peut être remplacé par l'utilisateur.
// ─────────────────────────────────────────────────────────


export const TEMPLATES = [

  // ── Écriture ──────────────────────────────────────────

  {
    id: 'summarize',
    icon: '📄',
    label: 'Summarize',
    category: 'Writing',
    prompt: `Summarize the following text in 3 bullet points. Be concise and focus on the key insights. Avoid filler words.

Text: {{input}}`,
  },

  {
    id: 'email-rewrite',
    icon: '✉️',
    label: 'Rewrite Email',
    category: 'Writing',
    prompt: `Rewrite the following email to be more professional, concise, and clear. Keep the same intent but improve tone and structure.

Original email:
{{input}}`,
  },

  // ── Code ──────────────────────────────────────────────

  {
    id: 'code-review',
    icon: '🔍',
    label: 'Code Review',
    category: 'Code',
    prompt: `Review the following code and provide:
1. A brief summary of what it does
2. Up to 3 potential issues or improvements
3. A revised version if needed

Code:
\`\`\`
{{input}}
\`\`\``,
  },

  {
    id: 'sql-gen',
    icon: '🗄️',
    label: 'Generate SQL',
    category: 'Code',
    prompt: `Write a SQL query to accomplish the following:

Task: {{input}}

Requirements:
- Use standard SQL (PostgreSQL compatible)
- Add comments for complex parts
- Optimize for readability`,
  },

  // ── Apprentissage ─────────────────────────────────────

  {
    id: 'explain-concept',
    icon: '💡',
    label: 'Explain Concept',
    category: 'Learning',
    prompt: `Explain {{input}} as if I'm a smart 16-year-old with no prior knowledge of this topic. Use an analogy, then give a concrete real-world example. Keep it under 200 words.`,
  },

  // ── Créativité ────────────────────────────────────────

  {
    id: 'brainstorm',
    icon: '🧠',
    label: 'Brainstorm',
    category: 'Creative',
    prompt: `Generate 5 creative and unconventional ideas for: {{input}}

For each idea:
- Title (3-5 words)
- One sentence description
- Why it's unique

Avoid generic or obvious suggestions.`,
  },

]


// Catégories disponibles dans le filtre de la Sidebar
export const CATEGORIES = ['All', 'Writing', 'Code', 'Learning', 'Creative']
