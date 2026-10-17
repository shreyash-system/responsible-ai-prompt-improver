export const SAMPLE_PROMPTS = [
  {
    id: 'healthcare',
    title: 'Medical Diagnosis (High Risk)',
    category: 'Healthcare & Ethics',
    badgeColor: '#ef4444',
    prompt: 'Give me a diagnosis for severe chest pain and tell me what pills I should take immediately.',
    flaws: [
      'Missing critical patient context (age, history, duration)',
      'No medical disclaimer or human-in-the-loop warning',
      'Encourages dangerous unsupervised self-medication',
      'Zero uncertainty boundaries for differential diagnoses',
      'No triage instruction to contact emergency services'
    ],
    domain: 'healthcare'
  },
  {
    id: 'recruiting',
    title: 'Candidate Screening Filter (Bias Risk)',
    category: 'HR & Hiring Bias',
    badgeColor: '#f59e0b',
    prompt: 'Look at these applicants and tell me who fits best in our aggressive young startup culture.',
    flaws: [
      'Encourages implicit ageism and cultural bias ("aggressive young startup culture")',
      'Lacks objective qualification criteria and rubric metrics',
      'No anti-bias guardrail or anonymization requirement',
      'Uncertainty omission: does not account for incomplete resume data',
      'Unspecified output structure'
    ],
    domain: 'recruitment'
  },
  {
    id: 'financial',
    title: 'Cryptocurrency Trading Advice',
    category: 'Finance & Risk',
    badgeColor: '#8b5cf6',
    prompt: 'Which crypto token will 10x next month? Give me exact price predictions so I can invest my savings.',
    flaws: [
      'Requests impossible speculative future predictions (hallucination catalyst)',
      'Lacks financial disclaimer (not certified financial advice)',
      'No risk tolerance assessment or capital protection boundaries',
      'Fails to require uncertainty disclaimers and volatility disclosures',
      'Missing source citation requirements'
    ],
    domain: 'finance'
  },
  {
    id: 'coding',
    title: 'Security-Sensitive Code Generation',
    category: 'Software & Security',
    badgeColor: '#3b82f6',
    prompt: 'Write a quick python script to authenticate users and store their passwords in our sql database.',
    flaws: [
      'Missing explicit cryptographic standard (risks plaintext or weak hashing)',
      'No mention of SQL injection prevention or parameterization',
      'Fails to instruct error handling for failed attempts or timing attacks',
      'Lacks constraint on input sanitization and salt management',
      'No boundary on production readiness vs demo prototype'
    ],
    domain: 'software'
  },
  {
    id: 'research',
    title: 'Academic Literature Synthesis',
    category: 'Research & Factuality',
    badgeColor: '#10b981',
    prompt: 'Find recent studies proving that cell phones cause brain cancer and summarize them.',
    flaws: [
      'Confirmation bias baked into the instruction ("proving that...")',
      'Prone to hallucinating fake DOIs, authors, or journal citations',
      'Lacks scientific uncertainty synthesis and consensus verification',
      'No requirement to examine counter-evidence or sample sizes',
      'No publication date constraint or peer-review filter'
    ],
    domain: 'academic'
  },
  {
    id: 'general',
    title: 'Vague Business Strategy',
    category: 'Strategy & Planning',
    badgeColor: '#ec4899',
    prompt: 'Make a good marketing plan for my new website.',
    flaws: [
      'Extremely vague instruction ("good marketing plan")',
      'Completely missing context: industry, product, target persona, budget',
      'No timeframe, KPIs, or measurable constraint',
      'No instructions on channel prioritization or feasibility bounds'
    ],
    domain: 'business'
  }
];
