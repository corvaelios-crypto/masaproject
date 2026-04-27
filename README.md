# PromptForge ⚡

A prompt engineering studio built with React + Vite + Groq (free & blazing fast).

## Features

- **Playground** — Write, run and iterate on prompts with streaming output
- **Quality Score** — AI-powered analysis: clarity, specificity, structure, hallucination risk
- **A/B Comparator** — Test two prompts side by side simultaneously
- **Template Library** — 6 ready-to-use prompt templates across categories
- **Version History** — Save and switch between prompt versions
- **Dark/Light mode** — Auto-detects your system preference

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

### 3. Add your Groq API key

- Go to [console.groq.com/keys](https://console.groq.com/keys)
- Create a free account and generate an API key
- Click "Add API key" in the app top bar and paste it
- Your key is stored only in your browser's localStorage

## Stack

- React 18 + Vite
- Tailwind CSS
- Groq API (llama-3.3-70b-versatile)
- Lucide icons
- Google Fonts: Syne + DM Mono

## Build for production

```bash
npm run build
```
