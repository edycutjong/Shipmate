<div align="center">
  <a href="https://shipmate.edycu.dev/">
    <img src="public/og-image.png" alt="Shipmate Project Banner" width="800" />
  </a>
  <br/>
  <h1>🚢 Shipmate</h1>
  <p><em>Paste your GitHub repo → get a landing page, Product Hunt comment, and viral Twitter thread. From code to launch in 30 seconds.</em></p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/OpenAI-gpt--4o-412991?logo=openai" alt="OpenAI" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css" alt="Tailwind" />
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/CI-passing-brightgreen" alt="CI" />
    <img src="https://img.shields.io/badge/coverage-100%25-brightgreen" alt="Coverage" />
  </p>

  <a href="https://shipmate.edycu.dev/"><img src="https://img.shields.io/badge/Live_Demo-▶_shipmate.edycu.dev-00ffaa?logo=vercel" alt="Live Demo" /></a>
  <a href="https://youtu.be/QJSom_BLiRM"><img src="https://img.shields.io/badge/Pitch_Video-▶_Watch_Now-red?logo=youtube" alt="Pitch Video" /></a>
</div>

---

## 📸 See it in Action
*(Demo showing the simultaneous AI generation of three marketing assets streaming via SSE)*

### 1. Landing Page to Dashboard Flow
<img width="100%" alt="landing-to-dashboard-broll" src="https://github.com/user-attachments/assets/b44e515c-a4b7-4449-92dd-2bf311bea2a2" />

### 2. Edge Case: Full-Stack Web3 & AI Integration
<img width="100%" alt="clawsearch-darkdesk-hero-to-dashboard-broll" src="https://github.com/user-attachments/assets/abba75da-5783-49c6-90e7-9fbb74a01b14" />

### 3. Edge Case: Offline Multimodal AI
<img width="100%" alt="RescueNodeZero-hero-to-dashboard-broll" src="https://github.com/user-attachments/assets/647c10b0-fbf0-4ed1-8627-6d3798f0156f" />

### 4. Edge Case: Pure Python CLI Script
<img width="100%" alt="terminalrescue py-hero-to-dashboard-broll" src="https://github.com/user-attachments/assets/615daf94-482f-4542-b03e-9772e5bab44d" />

## 💡 The Problem & Solution

Every developer has been here: you just spent 48 hours building something incredible. Then you hit a wall. You stare at a blank Google Doc to write your landing page copy, or write a terrible "I built a thing" tweet. **The gap between "I built it" and "people know about it" kills more startups than bad code.**

**Shipmate** solves this by autonomously reading your codebase and writing your launch materials for you.

**Key Features:**
- 🏠 **Code-Aware Landing Page:** Generates a hero headline, feature blocks, and CTA based on your actual tech stack and recent commits. Export as HTML.
- 🚀 **Product Hunt Comment Generator:** Follows the proven maker launch format (problem → solution → ask) that gets upvotes.
- 🐦 **Viral Twitter Thread:** Generates a 5-part technical build narrative from your GitHub commit history.
- ⚡ **Simultaneous Streaming:** All three launch assets stream side-by-side in real-time. No loading spinners, full visual spectacle.

## 🏗️ Architecture & Tech Stack
We built the frontend using **Next.js 16 (App Router)** and **Tailwind CSS v4**. Code analysis uses the **GitHub REST API**, and generation is handled by **OpenAI gpt-4o** using real-time Server-Sent Events (SSE) streaming for immediate visual feedback.

<img width="100%" alt="Shipmate Architecture Diagram" src="docs/architecture.png" />

## 🏆 Sponsor Tracks Targeted

* **Primary Track**: Build a product using Syntra — Developer Tools / SaaS
* **Syntra Excellence**: Shipmate itself was built entirely using Syntra! It's a meta-recursive project: Shipmate can generate a "Built with Syntra" case study from its own repository. See the `SYNTRA_USAGE.md` file in the repo for exact prompt logs and time savings. We successfully demonstrated "From Prompt to Product to Profit".

## 🚀 Run it Locally (For Judges)

1. **Clone the repo:** `git clone https://github.com/edycutjong/shipmate.git`
2. **Install dependencies:** `npm install`
3. **Set up environment variables:** 
   ```bash
   cp .env.example .env.local
   ```
   Add your `OPENAI_API_KEY` and personal `GITHUB_TOKEN` to `.env.local`.
4. **Run the app:** `npm run dev`

> **Note for Judges:** 
> You can skip making an account! There is zero authentication required. The app is fully self-contained. Simply paste any public GitHub URL and click "Analyze"!

## 📄 License

MIT © 2026 [Edy Cu](https://github.com/edycutjong)
