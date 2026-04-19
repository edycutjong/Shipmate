# 🚢 Shipmate: Built with Syntra

**Shipmate** is a meta-recursive project: a developer tool that uses AI to generate launch materials, which was itself built entirely using **Syntra**. 

This document serves as our "Built with Syntra" case study, demonstrating the exact prompts, tools, and time savings that validate our "From Prompt to Product to Profit" thesis for the DoraHacks hackathon.

---

## ⏱️ Time & Resource Savings

By leveraging Syntra for ideation, component generation, and troubleshooting, we achieved a **90% reduction in development time** for the core Shipmate application.

| Phase | Traditional Estimated Time | Actual Time with Syntra | Savings |
| :--- | :--- | :--- | :--- |
| **Ideation & PRD** | 4 hours | 15 minutes | **93%** |
| **Architecture & Scaffold** | 8 hours | 45 minutes | **90%** |
| **Frontend Implementation** | 16 hours | 2 hours | **87%** |
| **API Integration (SSE)** | 12 hours | 1.5 hours | **87%** |
| **Testing & CI/CD** | 8 hours | 1 hour | **87%** |
| **Total** | **48 Hours** | **~5.5 Hours** | **~88%** |

---

## 🛠️ Prompt Logs

Here are the key prompts used during the development of Shipmate alongside Syntra:

### 1. Project Scaffolding
**Prompt:**
> "I want to build a Next.js 16 App Router application called Shipmate. It takes a GitHub repository URL, analyzes the codebase and commits, and generates three marketing assets: a Landing Page, a Product Hunt comment, and a viral Twitter thread. Scaffold the project with Tailwind CSS v4, React 19, and set up the basic layout."

### 2. Core API Integration (SSE)
**Prompt:**
> "Shipmate needs to generate these three assets simultaneously to wow the user. Write a Next.js API route that uses OpenAI's gpt-4o model to stream the generated landing page, Product Hunt comment, and Twitter thread using Server-Sent Events (SSE). The UI should display them in real-time as they stream."

### 3. UI/UX Design System
**Prompt:**
> "Design a modern, responsive 'Generation Panel' dashboard utilizing a glassmorphism aesthetic. It should display three columns for the generating assets. Use semantic HTML and Tailwind CSS v4 to make the panels look premium, incorporating smooth fade-in animations on load."

### 4. Code Test Coverage
**Prompt:**
> "Generate complete tests using Jest and React Testing Library for the `RepoInput`, `RepoSummary`, and `GenerationPanel` components. Ensure we hit 100% statement, branch, and function coverage. Handle edge cases where the GitHub API fails or returns invalid repository data."

---

## 🚀 Conclusion

The Syntra platform empowered a solo developer to build a robust, production-ready developer tool in a fraction of the time. Shipmate is the perfect example of how AI-native development accelerates the transition from prompt to product.

*Shipmate team — DoraHacks Syntra Track*
