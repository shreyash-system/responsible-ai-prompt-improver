// Responsible AI Prompt Analyzer Engine

export function analyzePrompt(rawPrompt) {
  if (!rawPrompt || rawPrompt.trim().length === 0) {
    return {
      overallScore: 0,
      scores: { clarity: 0, context: 0, constraints: 0, uncertainty: 0, ethics: 0 },
      status: 'Empty',
      deficiencies: ['Prompt is empty. Please enter instructions to analyze.'],
      positives: [],
      domain: 'general',
      riskLevel: 'LOW',
      details: {}
    };
  }

  const text = rawPrompt.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const deficiencies = [];
  const positives = [];
  const recommendations = [];

  // ==========================================
  // 1. CLARITY & SPECIFICITY (20 pts)
  // ==========================================
  let clarityScore = 20;
  const vagueWords = ['good', 'best', 'nice', 'quick', 'cool', 'fast', 'awesome', 'simple', 'bad', 'great', 'somehow', 'something', 'stuff', 'things'];
  const foundVagueWords = vagueWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(lower));

  if (wordCount < 8) {
    clarityScore -= 12;
    deficiencies.push({
      pillar: 'Clarity',
      severity: 'high',
      title: 'Prompt is extremely short and under-specified',
      desc: 'Prompts under 8 words leave goals ambiguous, leading to generic or inaccurate LLM responses.'
    });
  } else if (wordCount < 16) {
    clarityScore -= 6;
    deficiencies.push({
      pillar: 'Clarity',
      severity: 'medium',
      title: 'Brief prompt with minimal detail',
      desc: 'Consider elaborating on your exact objective, background details, and desired depth.'
    });
  }

  if (foundVagueWords.length > 0) {
    clarityScore -= Math.min(8, foundVagueWords.length * 3);
    deficiencies.push({
      pillar: 'Clarity',
      severity: 'medium',
      title: `Subjective terms detected: "${foundVagueWords.slice(0, 3).join('", "')}"`,
      desc: 'Replace subjective adjectives with measurable criteria and objective benchmarks.'
    });
  }

  const roleKeywords = ['act as', 'you are a', 'as an expert', 'role:', 'your persona', 'as a professional', 'expert in'];
  const hasRole = roleKeywords.some(rk => lower.includes(rk));
  if (hasRole) {
    positives.push('Explicit role/persona assigned to steer domain expertise');
  } else {
    clarityScore -= 4;
    recommendations.push('Assign a clear system persona (e.g., "Act as a Senior Clinical Epidemiologist")');
  }

  clarityScore = Math.max(0, Math.min(20, clarityScore));

  // ==========================================
  // 2. CONTEXT & AUDIENCE SPECIFICATION (20 pts)
  // ==========================================
  let contextScore = 20;
  const audienceKeywords = ['audience', 'for beginners', 'for developers', 'for patients', 'for students', 'for executives', 'target reader', 'technical level', 'tone'];
  const hasAudience = audienceKeywords.some(ak => lower.includes(ak));

  if (hasAudience) {
    positives.push('Target audience or tone is explicitly specified');
  } else {
    contextScore -= 8;
    deficiencies.push({
      pillar: 'Context',
      severity: 'medium',
      title: 'Missing target audience or user persona',
      desc: 'Without knowing who this output is for, the AI cannot calibrate vocabulary, complexity, or tone.'
    });
  }

  const contextKeywords = ['context:', 'background:', 'given that', 'scenario:', 'here is the data', 'input:', 'parameters:'];
  const hasContextKeywords = contextKeywords.some(ck => lower.includes(ck));

  if (hasContextKeywords || wordCount > 35) {
    positives.push('Provides background context or domain specifics');
  } else {
    contextScore -= 7;
    deficiencies.push({
      pillar: 'Context',
      severity: 'medium',
      title: 'Lacks background information or reference data',
      desc: 'Provide domain details, current state, or concrete inputs so the model does not guess.'
    });
  }

  contextScore = Math.max(0, Math.min(20, contextScore));

  // ==========================================
  // 3. CONSTRAINTS & OUTPUT BOUNDARIES (20 pts)
  // ==========================================
  let constraintsScore = 20;
  const formatKeywords = ['json', 'table', 'bullet points', 'markdown', 'step-by-step', 'format:', 'schema', 'headers', 'numbered list', 'csv'];
  const hasFormat = formatKeywords.some(fk => lower.includes(fk));

  if (hasFormat) {
    positives.push('Defines explicit output structure/format');
  } else {
    constraintsScore -= 9;
    deficiencies.push({
      pillar: 'Constraints',
      severity: 'medium',
      title: 'No output structure or formatting constraint',
      desc: 'Specify desired output format (e.g., Markdown headers, bullet points, JSON, structured table).'
    });
  }

  const negativeConstraintKeywords = ['do not', 'don\'t', 'never', 'avoid', 'exclude', 'limit to', 'maximum', 'at most', 'without'];
  const hasNegativeConstraints = negativeConstraintKeywords.some(nk => lower.includes(nk));

  if (hasNegativeConstraints) {
    positives.push('Includes negative boundaries or exclusion rules ("Do not...")');
  } else {
    constraintsScore -= 7;
    deficiencies.push({
      pillar: 'Constraints',
      severity: 'low',
      title: 'Missing negative boundaries',
      desc: 'Explicit negative constraints (e.g., "Do not use technical jargon", "Avoid unverified claims") drastically improve reliability.'
    });
  }

  constraintsScore = Math.max(0, Math.min(20, constraintsScore));

  // ==========================================
  // 4. UNCERTAINTY & HALLUCINATION DEFENSE (20 pts)
  // ==========================================
  let uncertaintyScore = 20;
  const uncertaintyKeywords = [
    'if you do not know', 'if you don\'t know', 'say "i don\'t know"', 'state assumptions',
    'cite sources', 'do not speculate', 'do not fabricate', 'indicate confidence',
    'highlight uncertainty', 'acknowledge limits', 'uncertainty', 'unknown'
  ];
  const hasUncertaintyHandling = uncertaintyKeywords.some(uk => lower.includes(uk));

  const speculativeTriggers = ['will happen', 'predict', 'exact price', '10x', 'cure for', 'prove that', 'promise', 'guarantee'];
  const hasSpeculation = speculativeTriggers.some(st => lower.includes(st));

  if (hasUncertaintyHandling) {
    positives.push('Explicit uncertainty fallback: instructs the AI to acknowledge gaps or state assumptions');
  } else {
    uncertaintyScore -= 14;
    deficiencies.push({
      pillar: 'Uncertainty',
      severity: 'high',
      title: 'Zero hallucination guardrails or uncertainty handling',
      desc: 'When an LLM does not know an answer or data is missing, it will confidently invent false facts unless explicitly told to state uncertainty.'
    });
  }

  if (hasSpeculation && !hasUncertaintyHandling) {
    uncertaintyScore -= 6;
    deficiencies.push({
      pillar: 'Uncertainty',
      severity: 'high',
      title: 'High hallucination risk: speculative queries without epistemic boundaries',
      desc: 'Asking for absolute predictions or proof invites fabricated data, false certainty, and confirmation bias.'
    });
  }

  uncertaintyScore = Math.max(0, Math.min(20, uncertaintyScore));

  // ==========================================
  // 5. RESPONSIBLE AI, FAIRNESS & SAFETY (20 pts)
  // ==========================================
  let ethicsScore = 20;
  let riskLevel = 'LOW';
  let domain = 'general';

  // High Stakes Check: Medical
  const medicalWords = ['diagnosis', 'pills', 'medicine', 'chest pain', 'symptom', 'disease', 'dosage', 'prescription', 'cancer', 'cure'];
  const isMedical = medicalWords.some(mw => lower.includes(mw));
  if (isMedical) domain = 'healthcare';

  // High Stakes Check: Legal / Financial
  const financeWords = ['crypto', 'invest', 'stock', 'token', 'savings', 'portfolio', 'lawsuit', 'legal contract', 'financial advice'];
  const isFinance = financeWords.some(fw => lower.includes(fw));
  if (isFinance && domain === 'general') domain = 'finance';

  // High Stakes Check: Recruitment / Bias
  const biasWords = ['young', 'culture fit', 'aggressive', 'old', 'race', 'gender', 'female', 'male', 'applicants', 'hire', 'screening'];
  const isRecruiting = ['applicants', 'hire', 'screening', 'culture fit', 'candidate'].some(rw => lower.includes(rw));
  if (isRecruiting) domain = 'recruitment';

  // High Stakes Check: Security / Credentials
  const securityWords = ['password', 'sql database', 'api key', 'secret', 'hash', 'credential', 'hack', 'bypass', 'authenticate'];
  const isSecurity = securityWords.some(sw => lower.includes(sw));
  if (isSecurity && domain === 'general') domain = 'software';

  // Detect Bias & Stereotyping risk
  const biasTriggers = ['aggressive young', 'female vs male', 'culture fit', 'native speaker only', 'best race', 'young startup'];
  const hasBiasRisk = biasTriggers.some(bt => lower.includes(bt));

  // Check for Human-in-the-loop / Disclaimers
  const disclaimerKeywords = ['disclaimer', 'consult a doctor', 'not financial advice', 'for informational purposes only', 'human review', 'fairness', 'unbiased', 'blind review'];
  const hasDisclaimer = disclaimerKeywords.some(dk => lower.includes(dk));

  if (isMedical) {
    if (!hasDisclaimer) {
      ethicsScore -= 12;
      riskLevel = 'CRITICAL';
      deficiencies.push({
        pillar: 'Ethics & Safety',
        severity: 'critical',
        title: 'Safety Risk: Unsupervised medical advice without emergency triage or disclaimer',
        desc: 'AI must not issue definitive diagnostic advice or prescribe medication without mandatory medical disclaimers and urgent care triage.'
      });
    } else {
      positives.push('Includes medical disclaimer and physician escalation');
    }
  }

  if (isFinance) {
    if (!hasDisclaimer) {
      ethicsScore -= 8;
      if (riskLevel !== 'CRITICAL') riskLevel = 'HIGH';
      deficiencies.push({
        pillar: 'Ethics & Safety',
        severity: 'high',
        title: 'Financial liability risk: Missing investment & volatility disclosure',
        desc: 'Prompts requesting investment or trading advice must include non-fiduciary disclaimers and volatility warnings.'
      });
    }
  }

  if (hasBiasRisk) {
    ethicsScore -= 12;
    if (riskLevel !== 'CRITICAL') riskLevel = 'HIGH';
    deficiencies.push({
      pillar: 'Ethics & Safety',
      severity: 'critical',
      title: 'Fairness Risk: Prompt contains biased or discriminatory filtering language',
      desc: 'Terms like "aggressive young culture" introduce age and cultural discrimination into decision algorithms.'
    });
  }

  if (isSecurity && !lower.includes('salt') && !lower.includes('bcrypt') && !lower.includes('sanitize')) {
    ethicsScore -= 6;
    if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
    deficiencies.push({
      pillar: 'Ethics & Safety',
      severity: 'medium',
      title: 'Security Hygiene: Missing secure coding & credential handling mandates',
      desc: 'Explicitly enforce industry standards (e.g. bcrypt/argon2 hashing, parameterized queries, zero plaintext).'
    });
  }

  if (hasDisclaimer) {
    positives.push('Includes safety guardrail or regulatory disclaimer requirement');
  }

  ethicsScore = Math.max(0, Math.min(20, ethicsScore));

  // Compute Total Score out of 100
  const overallScore = clarityScore + contextScore + constraintsScore + uncertaintyScore + ethicsScore;

  let status = 'Poor';
  let statusColor = '#ef4444';
  if (overallScore >= 85) {
    status = 'Responsible & Production-Ready';
    statusColor = '#10b981';
  } else if (overallScore >= 65) {
    status = 'Moderate (Needs Guardrails)';
    statusColor = '#f59e0b';
  } else if (overallScore >= 45) {
    status = 'Fragile (High Hallucination/Safety Risk)';
    statusColor = '#f97316';
  } else {
    status = 'Critical Flaws (Unsafe & Ambiguous)';
    statusColor = '#ef4444';
  }

  return {
    overallScore,
    status,
    statusColor,
    riskLevel,
    domain,
    scores: {
      clarity: clarityScore,         // /20
      context: contextScore,         // /20
      constraints: constraintsScore, // /20
      uncertainty: uncertaintyScore, // /20
      ethics: ethicsScore            // /20
    },
    deficiencies,
    positives,
    recommendations,
    wordCount
  };
}
