// Google Gemini API Integration for Generative Prompt Enhancement

const GEMINI_MODEL = 'gemini-3.8-flash';

export async function testGeminiApiKey(apiKey) {
  if (!apiKey || apiKey.trim().length < 10) {
    throw new Error('Please enter a valid Gemini API key.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: 'Respond with the single word: "VALID"' }]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: Failed to validate API key.`);
  }

  return true;
}

export async function enhancePromptWithGemini(rawPrompt, apiKey, options = {}) {
  if (!apiKey) {
    throw new Error('Gemini API key is required for live AI enhancement.');
  }

  const {
    uncertaintyStrictness = 'high',
    targetAudience = 'Professional',
    outputFormat = 'Structured Markdown with Headers'
  } = options;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;

  const systemInstruction = `You are AegisPrompt, an elite Responsible AI Prompt Engineering Architect.
Your task is to take a raw, ambiguous, or poorly constructed user prompt and transform it into an industry-grade, Responsible AI-compliant prompt.

You MUST ensure the improved prompt adheres to:
1. Clear System Persona & Domain Expertise
2. Unambiguous Task Definition & Target Audience (${targetAudience})
3. Relevant Context & Placeholders for domain specifics
4. Strict Operational and Negative Constraints (e.g. what NOT to do)
5. Robust Uncertainty & Epistemic Boundaries (instructing the model to admit ignorance, state assumptions, calibrate confidence, and NEVER hallucinate facts or citations)
6. Ethical, Safety, Bias Mitigation, and Mandatory Disclaimers (especially for medical, legal, financial, or hiring domains)
7. Explicit Desired Output Structure (${outputFormat})

Format your response strictly as valid JSON with this exact schema:
{
  "improvedPrompt": "string (the complete markdown formatted enhanced prompt)",
  "role": "string (the assigned system persona)",
  "domain": "string (healthcare | finance | recruitment | software | academic | general)",
  "breakdown": [
    {
      "pillar": "string (Clarity | Context | Constraints | Uncertainty | Ethics & Safety)",
      "title": "string (short description of what was added)",
      "desc": "string (why this change protects responsible AI behavior)"
    }
  ],
  "critique": "string (brief summary of major flaws in the original prompt)"
}`;

  const promptBody = {
    contents: [{
      parts: [{
        text: `Raw Prompt to Improve: "${rawPrompt}"\n\nRequirements:\n- Epistemic Uncertainty Strictness: ${uncertaintyStrictness}\n- Output Format Preference: ${outputFormat}`
      }]
    }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(promptBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error (Status ${response.status})`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('No content returned from Gemini model.');
  }

  try {
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch {
    // If json parse failed, wrap plain text
    return {
      improvedPrompt: rawText,
      role: 'Subject Matter Specialist',
      domain: 'general',
      breakdown: [
        {
          pillar: 'Clarity & Constraints',
          title: 'Enhanced Prompt Structure',
          desc: 'Refactored prompt with explicit instructions and formatting.'
        }
      ],
      critique: 'Raw prompt refined for improved precision and safety.'
    };
  }
}
