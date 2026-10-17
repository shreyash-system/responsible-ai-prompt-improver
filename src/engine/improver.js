// Intelligent Heuristic Responsible AI Prompt Improver

export function generateImprovedPrompt(rawPrompt, analysis, options = {}) {
  const {
    uncertaintyStrictness = 'high',
    safetyLevel = 'strict',
    targetAudience = 'Technical / Professional',
    outputFormat = 'Structured Markdown with Headers',
    includeConfidenceScores = true,
    includeNegativeConstraints = true
  } = options;

  const domain = analysis.domain || 'general';
  const cleanInput = rawPrompt.trim();

  // 1. Determine Domain-Specific Archetype
  let role = 'Senior Subject Matter Specialist and Responsible AI Advisor';
  let primaryTask = cleanInput;
  let contextSection = '';
  let constraintsList = [];
  let uncertaintyList = [];
  let ethicsList = [];
  let formatGuide = '';
  const improvementsBreakdown = [];

  // Domain tailoring
  if (domain === 'healthcare') {
    role = 'Board-Certified Clinical Communication & Medical Information Specialist';
    primaryTask = `Provide an educational, evidence-based triage overview regarding: "${cleanInput}". Do not provide an unsupervised medical diagnosis or prescribe specific drug dosages.`;
    contextSection = `[Patient Profile / Symptom Context - User to provide: Age, Duration, Accompanying symptoms (e.g., shortness of breath, radiating pain), Medical history]`;
    
    constraintsList.push('Immediately provide an emergency warning advising the user to contact emergency services (e.g. 911 / local emergency number) if acute symptoms are present.');
    constraintsList.push('List potential differential categories strictly for educational discussion with a licensed healthcare professional.');
    constraintsList.push('Do not recommend specific prescription medication or unsupervised drug dosages.');

    uncertaintyList.push('Explicitly state that text-based AI cannot substitute clinical examination, ECG, or lab diagnostics.');
    uncertaintyList.push('Acknowledge limitations: if symptom details are incomplete, note what diagnostic ambiguities exist.');

    ethicsList.push('Include a prominent Medical Disclaimer: "This information is for informational and educational purposes only and is not medical advice or clinical diagnosis."');
    ethicsList.push('Emphasize human-in-the-loop: Always advise consulting a licensed physician.');

    improvementsBreakdown.push({
      pillar: 'Ethics & Safety',
      title: 'Added Emergency Triage & Medical Liability Shield',
      desc: 'Prevents unsupervised self-treatment of acute conditions by prioritizing physician consultation and emergency escalation.'
    });
    improvementsBreakdown.push({
      pillar: 'Uncertainty',
      title: 'Added Clinical Epistemic Boundaries',
      desc: 'Instructs the model to explicitly state diagnostic limitations rather than hallucinating a false definitive condition.'
    });

  } else if (domain === 'recruitment') {
    role = 'Chief Talent Officer & Inclusive Hiring Compliance Expert';
    primaryTask = `Develop an objective, competency-based candidate evaluation framework for: "${cleanInput}". Remove all discriminatory heuristics and subjective criteria.`;
    contextSection = `[Job Description & Rubric - User to provide: Specific job competencies, required technical skills, measurable KPI track records, and evaluation rubric]`;

    constraintsList.push('Completely eliminate subjective or discriminatory filters such as age, gender, culture fit, or aggressive personality tropes.');
    constraintsList.push('Structure evaluation strictly around verifiable competency criteria, work sample metrics, and proven domain skills.');
    constraintsList.push('Support anonymized / blind review principles where identifying candidate attributes are redacted.');

    uncertaintyList.push('If applicant data or resume credentials are incomplete, flag missing evidence as "Unverified" rather than guessing.');
    uncertaintyList.push('Avoid speculative personality profiling based on text semantics.');

    ethicsList.push('Enforce Fair Hiring & Equal Opportunity compliance (EEO principles).');
    ethicsList.push('Mitigate affinity bias and proximity bias by adhering to predetermined rubric scores.');

    improvementsBreakdown.push({
      pillar: 'Fairness & Ethics',
      title: 'De-Biased Evaluation & Anti-Ageism Filter',
      desc: 'Replaced vague and discriminatory terms like "aggressive young startup culture" with standardized, skill-based competencies.'
    });
    improvementsBreakdown.push({
      pillar: 'Constraints',
      title: 'Competency Rubric & Anonymized Scoring',
      desc: 'Mandated verifiable evidence criteria and blind evaluation to ensure fair, audit-ready candidate assessment.'
    });

  } else if (domain === 'finance') {
    role = 'Quantitative Financial Analyst and Risk Management Specialist';
    primaryTask = `Conduct an objective, risk-adjusted market analysis regarding: "${cleanInput}". Provide structural analysis rather than speculative price targets.`;
    contextSection = `[Market Asset / Sector Context - User to provide: Token/Asset ticker, investment horizon, portfolio risk tolerance, market capitalization context]`;

    constraintsList.push('Do NOT provide definitive price predictions or "guaranteed return" forecasts.');
    constraintsList.push('Disclose volatility risks, liquidity limitations, and downside drawdown scenarios.');
    constraintsList.push('Distinguish between historical performance and future probabilistic outcomes.');

    uncertaintyList.push('Acknowledge epistemic unpredictability in macroeconomic and speculative markets.');
    uncertaintyList.push('If future projections are discussed, state key underlying assumptions and sensitivity factors.');

    ethicsList.push('Include mandatory disclaimer: "Not Financial Advice (NFA). For educational and analytical research purposes only. Consult a registered financial advisor."');

    improvementsBreakdown.push({
      pillar: 'Uncertainty',
      title: 'Speculative Hallucination Safeguard',
      desc: 'Blocks the model from generating fictitious price targets or fake guarantees, replacing them with risk-adjusted probabilistic scenarios.'
    });
    improvementsBreakdown.push({
      pillar: 'Ethics & Safety',
      title: 'Financial Consumer Protection Guardrail',
      desc: 'Enforces non-fiduciary disclaimers and mandates clear disclosure of downside risk.'
    });

  } else if (domain === 'software') {
    role = 'Principal Software Security Engineer & OWASP Compliance Architect';
    primaryTask = `Design and implement a robust, production-grade security architecture for: "${cleanInput}". Prioritize defense-in-depth and vulnerability prevention.`;
    contextSection = `[System Environment - Target language/runtime, database engine, authentication framework, expected concurrency]`;

    constraintsList.push('Enforce secure password hashing using modern adaptive algorithms (Argon2id or bcrypt with unique cryptographic salt per user).');
    constraintsList.push('Use strictly parameterized / prepared SQL statements to guarantee prevention of SQL Injection (CWE-89).');
    constraintsList.push('Never store plaintext credentials, secrets, or unhashed sensitive data.');
    constraintsList.push('Implement constant-time comparison to prevent timing attacks during credential validation.');

    uncertaintyList.push('Distinguish between minimal proof-of-concept snippets and production-hardened requirements (e.g. rate limiting, audit logging).');
    uncertaintyList.push('If external security libraries are recommended, state version requirements and security assumptions.');

    ethicsList.push('Ensure user privacy (GDPR / CCPA principles) regarding personal credential storage.');

    improvementsBreakdown.push({
      pillar: 'Constraints',
      title: 'Hardened Security & Cryptographic Standards',
      desc: 'Mandated Argon2id/bcrypt hashing, parameterized queries, and constant-time checks to prevent catastrophic vulnerabilities.'
    });
    improvementsBreakdown.push({
      pillar: 'Clarity',
      title: 'Production Readiness Boundaries',
      desc: 'Distinguished secure architecture from toy scripts to ensure code safety.'
    });

  } else if (domain === 'academic') {
    role = 'Senior Research Scientist and Meta-Analytic Reviewer';
    primaryTask = `Synthesize peer-reviewed scientific literature and current consensus on: "${cleanInput}". Present balanced evidence including null results.`;
    contextSection = `[Research Scope - Subject discipline, acceptable publication date ranges, meta-analyses vs single observational studies]`;

    constraintsList.push('Do NOT present speculative hypotheses as proven causal relationships without robust epidemiological consensus.');
    constraintsList.push('Require explicit mention of study methodologies (randomized controlled trials vs cohort vs animal models).');
    constraintsList.push('Address confounding variables, sample size limitations, and potential publication bias.');

    uncertaintyList.push('Strict Citation Integrity: Do NOT fabricate or hallucinate fake paper titles, authors, or DOIs. If a specific paper is unconfirmed, describe the body of literature generally.');
    uncertaintyList.push('Explicitly summarize points of scientific debate and unresolved questions.');

    ethicsList.push('Avoid sensationalism or alarmism; maintain scientific objectivity.');

    improvementsBreakdown.push({
      pillar: 'Uncertainty',
      title: 'Zero-Fabrication Citation Guardrail',
      desc: 'Explicitly bans hallucinated citations and requires acknowledging scientific consensus vs ongoing debate.'
    });
    improvementsBreakdown.push({
      pillar: 'Clarity',
      title: 'Balanced Evidence & Methodology Rigor',
      desc: 'Requires distinguishing correlation from causation and evaluating study design quality.'
    });

  } else {
    // General Business / Knowledge
    role = 'Strategic Advisor and Systems Design Specialist';
    primaryTask = `Develop an actionable, structured, and comprehensive strategy for: "${cleanInput}". Ground the proposal in measurable milestones and realistic operational constraints.`;
    contextSection = `[Context Parameters - User to specify: Target market/audience, core value proposition, available budget/resources, and timeline]`;

    constraintsList.push('Define concrete, measurable KPIs and milestones rather than vague qualitative ambitions.');
    constraintsList.push('Incorporate risk factors and mitigation contingencies for each phase.');
    if (includeNegativeConstraints) {
      constraintsList.push('Avoid generic advice; provide actionable, prioritized recommendations.');
    }

    uncertaintyList.push('Highlight any assumptions made regarding customer behavior, technical feasibility, or resource availability.');
    uncertaintyList.push('If critical market data is unavailable, formulate specific research questions to validate assumptions.');

    ethicsList.push('Ensure compliance with ethical communication and user privacy standards.');

    improvementsBreakdown.push({
      pillar: 'Clarity',
      title: 'Operationalized Goals & Measurable KPIs',
      desc: 'Replaced vague terms with actionable milestones, deliverables, and resource considerations.'
    });
    improvementsBreakdown.push({
      pillar: 'Context',
      title: 'Parameterization & Audience Alignment',
      desc: 'Created structured context placeholders to align output with specific market parameters.'
    });
  }

  // Adjust uncertainty based on strictness
  if (uncertaintyStrictness === 'high') {
    uncertaintyList.push('Calibrate confidence: If you are uncertain about any fact, statistic, or claim, state your confidence level (High / Medium / Low) and outline what verification is required.');
    uncertaintyList.push('If requested information is beyond your training data or inaccessible, state "I do not have sufficient verifiable data to answer this" rather than approximating.');
    improvementsBreakdown.push({
      pillar: 'Uncertainty',
      title: 'High-Rigor Confidence Calibration',
      desc: 'Mandates explicit confidence intervals and explicit admission of knowledge boundaries.'
    });
  }

  // Output formatting rules
  formatGuide = `Present your response formatted in ${outputFormat}, structured with:
1. Executive Summary & Core Insights
2. Detailed Structured Recommendations (with clear subheadings)
3. Assumptions, Unknowns & Confidence Assessment
4. Ethical, Safety, or Compliance Disclaimers`;

  // Assemble the improved prompt
  const improvedPromptText = `### 🎯 System Role & Persona
You are a ${role}. Your communication must be rigorous, precise, objective, and adhere to responsible AI governance standards.

---

### 📋 Objective & Task
${primaryTask}

Target Audience: ${targetAudience}

---

### 🔍 Context & Input Parameters
${contextSection}

---

### 🛑 Strict Constraints & Boundaries
${constraintsList.map(c => `- ${c}`).join('\n')}

---

### ⚠️ Uncertainty & Hallucination Guardrails
${uncertaintyList.map(u => `- ${u}`).join('\n')}

---

### 🛡️ Responsible AI & Ethical Guardrails
${ethicsList.map(e => `- ${e}`).join('\n')}

---

### 📤 Expected Output Format
${formatGuide}
${includeConfidenceScores ? '\n*Note: Include a brief "Confidence & Verification" footer summarizing any key assumptions.*' : ''}`;

  return {
    improvedPrompt: improvedPromptText,
    breakdown: improvementsBreakdown,
    domain,
    role,
    optionsUsed: options
  };
}

// Generate realistic simulated comparison of LLM outputs
export function getSimulatedLLMOutputs(originalPrompt, domain) {
  if (domain === 'healthcare') {
    return {
      originalResponse: `Based on your severe chest pain, you might be experiencing angina or acute acid reflux. You should take an aspirin (325mg) right away and maybe an antacid like Omeprazole. If it doesn't get better in an hour, rest in bed.`,
      originalCritique: '🚨 DANGEROUS: The model hallucinates medication advice without vital context, prescribes aspirin (which is fatal in aortic dissection or internal bleeding), fails to advise 911 emergency dispatch, and downplays life-threatening symptoms.',
      improvedResponse: `🚨 **URGENT EMERGENCY NOTICE:**
If you or someone nearby is experiencing acute, severe chest pain—especially if accompanied by shortness of breath, pain radiating to the jaw/arm/back, lightheadedness, or nausea—**immediately call your local emergency services (e.g. 911) or go to the nearest emergency department.** Do not drive yourself.

---

### 1. Educational Overview (For Physician Discussion)
Chest pain can originate from several physiological systems, ranging from benign to critically acute:
- **Cardiovascular (Critical):** Acute Coronary Syndrome (Myocardial Infarction), Aortic Dissection, Pericarditis.
- **Pulmonary (Urgent):** Pulmonary Embolism, Pneumothorax.
- **Gastrointestinal / Musculoskeletal:** Esophageal spasm, severe GERD, Costochondritis.

### 2. Why Self-Medication is Contraindicated
- **Aspirin / Pain Relievers:** While standard in confirmed ischemic cardiac events, aspirin can cause fatal hemorrhage if the etiology is an aortic aneurysm dissection or active GI bleed.
- **No pill should be taken without emergency dispatcher or physician guidance.**

### 3. Epistemic Uncertainty & AI Limitations
- **Diagnostic Limitation:** Text-based AI models cannot perform electrocardiograms (ECG), troponin blood assays, or physical auscultation.
- **Confidence Level:** Low clinical certainty without in-person diagnostic telemetry.

*Disclaimer: This response is strictly educational and does not constitute medical advice or diagnosis.*`,
      improvedCritique: '✅ RESPONSIBLE: Prioritizes immediate patient safety with 911 triage, explains clinical ambiguity, avoids unsupervised medication, and strictly enforces medical disclaimers.'
    };
  }

  if (domain === 'recruitment') {
    return {
      originalResponse: `Here is the ranking for your startup:
1. Alex (Age 24) - Best fit! Young, energetic, hungry, will pull 70-hour work weeks and fits the aggressive startup culture.
2. David (Age 48) - Good technical experience, but might struggle to keep up with the fast-paced, late-night culture.`,
      originalCritique: '🚨 BIASED & ILLEGAL: Blatant age discrimination, assumes older candidates cannot work fast, rewards toxic overwork culture, and introduces serious legal liability.',
      improvedResponse: `### 1. Objective Competency Evaluation Rubric
To ensure fair, merit-based hiring and prevent unlawful bias (such as age or cultural stereotyping), candidates should be evaluated against standardized technical benchmarks:

| Competency Area | Weight | Evaluation Criteria | Verifiable Artifacts |
|---|---|---|---|
| **Core Architecture & Systems** | 40% | Distributed systems design, concurrency handling | GitHub repository / System design task |
| **Execution Velocity & Delivery**| 30% | Delivering high-impact milestones in ambiguity | Track record of shipped releases |
| **Collaborative Leadership** | 30% | Cross-functional communication, code review rigor | Structured behavioral interview scores |

### 2. Blind Review Recommendation
- Redact names, graduation years, photos, and personal identifiers to mitigate implicit affinity bias.
- Score candidates strictly on the pre-established rubric matrix prior to team debriefs.

### 3. Uncertainty & Missing Data Handling
- *Data Gap:* If resume lacks details on direct contributions vs team efforts, flag as "Requires Technical Probe" rather than assuming proficiency or deficit.`,
      improvedCritique: '✅ RESPONSIBLE: Eliminates ageist bias, introduces structured objective rubrics, supports blind evaluation, and handles resume data gaps with neutral verification flags.'
    };
  }

  // Default / General
  return {
    originalResponse: `Here is a marketing plan for your website:
- Post every day on Instagram and TikTok.
- Run Facebook ads with a $500 budget.
- Do SEO keyword research and write blog articles.
- Do influencer partnerships to go viral.`,
    originalCritique: '⚠️ VAGUE & UNCALIBRATED: Generic advice with zero context, no audience persona, no metrics, and unrealistic assumptions ("go viral").',
    improvedResponse: `### 1. Strategic Marketing Framework & Phased Rollout
Target Audience: Decision-makers and prospective customers in specified niche.

#### Phase 1: Foundation & Value Proposition (Weeks 1–2)
- **Positioning Audit:** Define unique selling proposition (USP) against 3 direct competitors.
- **Conversion Architecture:** Establish landing page benchmark (aiming for >3.5% visitor-to-lead conversion).
- **Analytics Baseline:** Deploy server-side tracking (GA4 + event telemetry) to measure attribution accurately.

#### Phase 2: High-Intent Acquisition Channels (Weeks 3–6)
- **Search Intent (SEO/PPC):** Focus strictly on high-intent long-tail transactional keywords.
- **Content Engine:** 2 high-depth problem-solving case studies per month.

### 2. Measurable Constraints & KPIs
- Target Cost Per Acquisition (CPA): Defined by customer lifetime value (LTV:CPA ratio ≥ 3:1).
- Risk Contingency: If organic CTR < 2% after 30 days, re-test value proposition headlines.

### 3. Assumptions & Uncertainty Disclosures
- *Assumption:* Assumes web infrastructure can handle traffic spikes without latency.
- *Confidence Level:* Moderate; channel efficacy must be validated via small-scale $100 A/B pilots before capital allocation.`,
    improvedCritique: '✅ RESPONSIBLE: Provides actionable structure, measurable KPIs, risk contingencies, and explicitly identifies underlying operational assumptions.'
  };
}
