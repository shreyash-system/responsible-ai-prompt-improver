# 📑 Practical Assignment Submission Report
## Ethical & Responsible AI Application: Prompt Improver

---

### 1. Step 1 — Problem Understanding & Implementation Plan

#### A. Problem Statement
Develop an application that accepts a poorly written or risky prompt and suggests an improved version with clearer instructions, relevant context, operational constraints, and epistemic uncertainty handling.

#### B. System Specifications
- **Inputs:**
  - Raw prompt string (unstructured text).
  - Target Audience selection (*Technical / Professional*, *General Public*, *Student*, *Executive*).
  - Output Format schema (*Structured Markdown*, *Step-by-Step*, *JSON Schema*, *Comparative Table*).
  - Epistemic Uncertainty Rigor (*High*, *Medium*, *Low*).
- **Outputs:**
  - Responsible AI Readiness Score (0–100) and Vulnerability Risk Tier (*LOW*, *MEDIUM*, *HIGH*, *CRITICAL*).
  - 5-Pillar Diagnostics breakdown (Clarity, Context, Constraints, Uncertainty Defense, Ethics & Safety).
  - Detected Deficiencies list with severity indicators.
  - Reconstructed Responsible AI Prompt with expert persona, clear tasks, negative boundaries, and epistemic safeguards.
  - Comparative simulation demonstrating LLM behavior on the raw prompt vs. the improved prompt.
- **Core Logic:**
  - Regex and heuristic lexical analyzer auditing 5 pillars.
  - Domain classifier (Healthcare, HR/Recruitment, Finance, Software Security, General Strategy).
  - Structured prompt reconstruction engine injecting epistemic uncertainty rules and mandatory disclaimers.
  - Input validation filter blocking empty, under-specified (< 3 words), or repetitive inputs.
- **Ethical Issues Addressed:**
  1. *Hallucination & Epistemic Overconfidence:* LLMs invent facts when prompts lack uncertainty boundaries.
  2. *Algorithmic Bias & Discrimination:* Vague evaluation prompts (e.g. "aggressive young startup culture") promote unlawful ageism and affinity bias.
  3. *Unsupervised High-Stakes Advice:* Prompts seeking medical diagnoses or financial speculation without disclaimers or triage endanger end-users.

#### C. Implementation Plan
1. **Scaffold Minimal Streamlit Project:** Configure Streamlit UI layout and custom CSS styling.
2. **Implement Input Validation:** Handle empty, short, and gibberish edge cases with clear warning messages.
3. **Build 5-Pillar Audit Engine:** Score prompts mathematically across Clarity, Context, Constraints, Uncertainty, and Ethics.
4. **Construct Prompt Reconstruction Engine:** Inject expert personas, negative constraints ("Do NOT..."), epistemic boundaries, and mandatory disclaimers.
5. **Add Comparative Sandbox:** Show side-by-side simulated AI responses to illustrate the ethical difference.
6. **Execute 3 Test Cases:** Document Normal, Edge-case, and High-Uncertainty scenarios.

---

### 2. Step 2 & 3 — Code Architecture & Section Breakdown (Viva Prep)

The code in `app.py` is structured into modular sections for clear explanation during your viva:

1. **Imports & Configuration (`Lines 1–90`):**
   - Configures Streamlit page, metadata, and CSS injection for visual indicators and risk badges.
2. **Input Validation (`validate_input`, `Lines 95–115`):**
   - Checks for empty strings, strips whitespace, blocks prompts under 3 words, and detects repetitive characters/words to prevent invalid processing.
3. **5-Pillar Audit Engine (`analyze_prompt`, `Lines 118–290`):**
   - Audits Clarity (vague terms, role existence), Context (audience, variables), Constraints (format, negative rules), Uncertainty (hallucination vulnerability), and Ethics (medical triage, bias keywords, financial liability).
4. **Prompt Reconstruction Engine (`generate_improved_prompt`, `Lines 293–430`):**
   - Injects domain-specific personas, explicit task instructions, negative rules, epistemic confidence calibration, and legal/medical disclaimers.
5. **Simulation Engine (`get_simulation_comparison`, `Lines 433–475`):**
   - Demonstrates the contrast between raw LLM behavior (unreliable/unsafe) vs. improved behavior (responsible).
6. **User Interface & Controls (`Lines 480–600`):**
   - Renders presets, input area, metrics, progress bars, tabs, and markdown download buttons.

---

### 3. Step 4 — Three Evaluation Test Cases & Results

#### Test Case 1: Normal Input (Under-specified task)
- **Input:** `"Make a good marketing plan for my new website."`
- **Observed Results:**
  - *Readiness Score:* 42/100 (Status: Fragile)
  - *Detected Flaws:* Subjective term `"good"`, missing audience, missing constraints/KPIs, zero uncertainty bounds.
  - *Improved Output:* Structured into Phase 1 (positioning audit) and Phase 2 (high-intent acquisition) with measurable KPIs (LTV:CPA >= 3:1) and operational assumptions.
  - *Pass/Fail:* **PASS**

#### Test Case 2: Invalid / Edge-Case Input
- **Input:** `"quick code"` (less than 3 words) or empty space.
- **Observed Results:**
  - *System Response:* Triggered `validate_input()`, safely halted processing.
  - *Error Displayed:* `⚠️ Input is too brief (less than 3 words). Please provide a meaningful task.`
  - *Pass/Fail:* **PASS** (Zero crash, clean error message).

#### Test Case 3: High-Risk / Uncertain Input (Hallucination & Harm Risk)
- **Input:** `"Give me a diagnosis for severe chest pain and tell me what pills I should take immediately."`
- **Observed Results:**
  - *Readiness Score:* 39/100 (Status: Critical Flaws)
  - *Vulnerability Risk:* `CRITICAL`
  - *Detected Flaws:* Severe medical liability, unsupervised drug prescription, zero emergency triage, no uncertainty boundaries.
  - *Improved Output:* Injected urgent 911 emergency advisory, banned self-medication/aspirin due to internal bleeding contraindications, and established epistemic boundaries noting that text-based AI cannot substitute ECG or blood assays.
  - *Pass/Fail:* **PASS**

---

### 4. Step 5 — Deployment Instructions

#### Method A: Streamlit Community Cloud (Recommended & Free)
1. Initialize git and commit:
   ```bash
   git init
   git add app.py requirements.txt README.md
   git commit -m "Initial commit of Responsible AI Prompt Improver"
   ```
2. Push to your GitHub account:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/responsible-ai-prompt-improver.git
   git branch -M main
   git push -u origin main
   ```
3. Visit [share.streamlit.io](https://share.streamlit.io) -> Click **New App** -> Select your repository, branch `main`, and main file `app.py` -> Click **Deploy**.
4. Your public URL will be live at: `https://<your-app-name>.streamlit.app`.

#### Method B: Local Execution (For In-Person Demo)
```bash
streamlit run app.py
```
Open `http://localhost:8501` in your browser.

---

### 5. Ethical Principles & System Limitations (Mandatory Disclosures)

#### Ethical Principles Addressed:
1. **Epistemic Honesty & Hallucination Prevention:** Directs AI to state knowledge gaps rather than fabricate answers.
2. **Fairness & Non-Discrimination:** De-biases candidate screening by stripping age and culture-fit filters.
3. **Harm Prevention & User Safety:** Restricts unsupervised medical diagnoses and dangerous advice.
4. **Transparency:** Makes all prompt adjustments explicit via itemized breakdowns.

#### System Limitations:
1. **Heuristic Evaluation:** Pattern-matching covers common vulnerabilities; novel adversarial phrasing may require continuous rubric updates.
2. **Advisory Tool:** Does not modify base model weights; downstream human oversight remains essential for high-stakes domains.
3. **Simulated Sandbox:** Simulator provides representative examples of LLM behavior for instructional demonstration.
