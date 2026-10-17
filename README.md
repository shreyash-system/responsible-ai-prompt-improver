# 🛡️ AegisPrompt | Responsible AI Prompt Improver

**AegisPrompt** is an advanced, production-grade web application designed to analyze, audit, and systematically transform poorly written or risky prompts into responsible, context-rich, constraint-guided instructions equipped with robust epistemic uncertainty handling and hallucination defenses.

---

## 🌟 Core Pillars of Responsible AI Implemented

1. **🎯 Clear Instructions & Role Calibration**
   - Eliminates ambiguous, subjective terms (e.g. *"good"*, *"fast"*, *"aggressive culture"*).
   - Assigns a domain-specific expert system persona (e.g., Board-Certified Medical Communicator, OWASP Security Architect, Inclusive Talent Officer).
   - Decomposes goals into verifiable, actionable sub-tasks.

2. **🔍 Relevant Context & Input Placeholders**
   - Injects structured placeholders for background data, constraints, and target audience calibration.
   - Calibrates vocabulary and depth according to the target audience (Layperson, Student, Professional, Executive).

3. **🛑 Strict Constraints & Output Schemas**
   - Mandates deterministic output structures (Structured Markdown, Step-by-Step, JSON Schema, Comparative Tables).
   - Implements **negative boundaries** (*"Do NOT assume"*, *"Do NOT prescribe unsupervised medication"*, *"Never store plaintext credentials"*).

4. **⚠️ Uncertainty & Epistemic Boundaries (Anti-Hallucination)**
   - Actively instructs the AI to **admit what it does not know** instead of guessing or confabulating.
   - Enforces explicit confidence indicators (High / Medium / Low) and demands that assumptions be clearly stated.
   - Implements **Zero-Fabrication Citation Rules** to prevent hallucinated DOIs, fake authors, or non-existent studies.

5. **⚖️ Ethics, Fairness & Safety Governance**
   - **Bias & Stereotype Neutralization:** Strips discriminatory tropes (age, culture fit, gender) and enforces objective rubrics and blind review.
   - **High-Stakes Liability Protection:** Embeds mandatory physician escalation & 911 triage for healthcare queries, and non-fiduciary disclaimers for financial topics.
   - **Security Standards:** Enforces modern cryptographic standards (Argon2id/bcrypt, parameterized SQL) for code generation.

---

## 🚀 Key Features

- **⚡ Dual-Engine Architecture (Hybrid):**
  - **Offline Heuristic & Ethics Engine:** Fully functional out-of-the-box without requiring an API key or internet connection.
  - **Live Google Gemini API Integration:** Connect your Gemini API key (e.g., `gemini-2.5-flash`) for deep generative semantic transformation. Keys remain strictly client-side in `localStorage`.
- **📊 5-Pillar Responsible AI Readiness Radar:**
  - Real-time audit scoring (0–100) across Clarity, Context, Constraints, Uncertainty Defense, and Ethics/Safety.
  - Granular severity badges: `CRITICAL RISK`, `HIGH DEFICIENCY`, `WARNING`, and `SUGGESTION`.
- **🔀 Side-by-Side Diff & Breakdown:**
  - Visual comparison between the original flawed prompt and the enhanced responsible prompt.
  - Itemized breakdown explaining *why* each guardrail was added.
- **🧪 Interactive LLM Response Sandbox:**
  - Real-time simulation demonstrating how a typical language model responds dangerously to the original prompt vs. safely and rigorously to the improved prompt.
- **🎨 Modern Glassmorphism UI:**
  - Dark/Light mode toggle, smooth micro-animations, and responsive layouts.
  - Pre-loaded with common flawed prompt scenarios (Healthcare, HR Bias, Crypto Speculation, Security Code, Literature Synthesis).
  - One-click copy, Markdown `.md` export, and local audit history drawer.

---

## 🛠️ Project Architecture

```
d:/VIT/TY/ERA/HA Project/
├── index.html                 # HTML shell with Google Fonts (Outfit, JetBrains Mono)
├── package.json               # Vite + React 19 + Lucide Icons
├── vite.config.js             # Vite configuration
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Application root with state orchestration
    ├── index.css              # Custom CSS design system (tokens, themes, animations)
    ├── data/
    │   └── samplePrompts.js   # Real-world flawed prompts across 6 domains
    ├── engine/
    │   ├── analyzer.js        # 5-Pillar diagnostic auditor & scoring algorithm
    │   └── improver.js        # Offline heuristic improvement generator & LLM simulator
    ├── services/
    │   └── geminiService.js   # Google Gemini API connector with local key validation
    └── components/
        ├── Header.jsx         # App bar, engine badge, theme toggle, API modal trigger
        ├── PromptInput.jsx    # Textarea, word counters, preset chips, action button
        ├── RefinementControls.jsx # Tuning drawer (Uncertainty rigor, audience, schema)
        ├── AuditScoreCard.jsx # 5-pillar scores, risk gauge, deficiency cards
        ├── ImprovedPromptView.jsx # 4-tab viewer (Enhanced, Diff, Breakdown, Sandbox)
        ├── ApiKeyModal.jsx    # Secure API key settings & connection tester
        ├── HistoryModal.jsx   # Local storage audit history viewer
        └── Toast.jsx          # Notification toasts
```

---

## 💻 Getting Started

### 1. Installation & Local Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Building for Production
```bash
npm run build
```
Creates an optimized production bundle in `/dist`.
