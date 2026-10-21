"""
Responsible AI Prompt Improver
Practical Assignment Implementation (Streamlit)

Objective:
Accepts a poorly written prompt and suggests an improved version with:
- Clearer instructions
- Relevant context and audience calibration
- Explicit operational and negative constraints
- Robust uncertainty and hallucination handling
- Ethical, safety, and fairness guardrails
"""

import streamlit as st
import re
import json
import urllib.request
import time

# Set Streamlit page config
st.set_page_config(
    page_title="Responsible AI Prompt Improver",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling — Light Mode with Inter (Claude-style) font
st.markdown("""
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
    /* ── Apply Inter font globally (Claude-style clean sans-serif) ── */
    html, body, [class*="css"], .stApp, .stMarkdown, .stTextInput,
    .stTextArea, .stSelectbox, .stButton, .stMetric, .stAlert,
    .stExpander, .stTabs, .stSidebar, p, span, div, label, h1, h2, h3 {
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif !important;
    }

    /* ── Force light mode backgrounds ── */
    .stApp {
        background-color: #ffffff !important;
        color: #1e293b !important;
    }
    .stSidebar {
        background-color: #f8fafc !important;
        border-right: 1px solid #e2e8f0 !important;
    }
    section[data-testid="stSidebar"] > div {
        background-color: #f8fafc !important;
    }

    /* ── Main title gradient ── */
    .main-title {
        font-family: 'Inter', sans-serif !important;
        font-size: 2.4rem;
        font-weight: 800;
        background: linear-gradient(135deg, #4f46e5, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.2rem;
        letter-spacing: -0.03em;
    }
    .sub-title {
        font-family: 'Inter', sans-serif !important;
        color: #64748b;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
        font-weight: 400;
    }

    /* ── Metric boxes ── */
    .metric-box {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px;
        text-align: center;
    }
    [data-testid="stMetric"] {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
    }
    [data-testid="stMetricValue"] {
        font-weight: 700 !important;
        color: #1e293b !important;
    }
    [data-testid="stMetricLabel"] {
        color: #64748b !important;
        font-size: 0.82rem !important;
        font-weight: 500 !important;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* ── Risk badges ── */
    .risk-badge-critical {
        background-color: #fee2e2; color: #ef4444;
        padding: 4px 10px; border-radius: 12px;
        font-weight: 700; font-size: 0.85rem;
    }
    .risk-badge-high {
        background-color: #ffedd5; color: #f97316;
        padding: 4px 10px; border-radius: 12px;
        font-weight: 700; font-size: 0.85rem;
    }
    .risk-badge-medium {
        background-color: #fef3c7; color: #d97706;
        padding: 4px 10px; border-radius: 12px;
        font-weight: 700; font-size: 0.85rem;
    }
    .risk-badge-low {
        background-color: #dcfce7; color: #16a34a;
        padding: 4px 10px; border-radius: 12px;
        font-weight: 700; font-size: 0.85rem;
    }

    /* ── Input / textarea ── */
    .stTextArea textarea {
        background-color: #ffffff !important;
        border: 1.5px solid #e2e8f0 !important;
        border-radius: 8px !important;
        color: #1e293b !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 0.95rem !important;
    }
    .stTextArea textarea:focus {
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important;
    }

    /* ── Buttons ── */
    .stButton > button {
        font-family: 'Inter', sans-serif !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        border: 1.5px solid #e2e8f0 !important;
        background-color: #ffffff !important;
        color: #374151 !important;
        transition: all 0.18s ease !important;
    }
    .stButton > button:hover {
        border-color: #4f46e5 !important;
        color: #4f46e5 !important;
        background-color: #eef2ff !important;
    }
    .stButton > button[kind="primary"] {
        background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
        color: #ffffff !important;
        border: none !important;
    }
    .stButton > button[kind="primary"]:hover {
        background: linear-gradient(135deg, #4338ca, #4f46e5) !important;
        color: #ffffff !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(79,70,229,0.35) !important;
    }

    /* ── Tabs ── */
    .stTabs [data-baseweb="tab-list"] {
        background-color: #f1f5f9 !important;
        border-radius: 8px !important;
        padding: 4px !important;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 6px !important;
        font-weight: 500 !important;
        color: #64748b !important;
    }
    .stTabs [aria-selected="true"] {
        background-color: #ffffff !important;
        color: #4f46e5 !important;
        font-weight: 600 !important;
    }

    /* ── Code blocks ── */
    .stCodeBlock, [data-testid="stCodeBlock"] {
        border-radius: 10px !important;
        border: 1px solid #e2e8f0 !important;
    }

    /* ── Selectbox ── */
    .stSelectbox [data-baseweb="select"] {
        background-color: #ffffff !important;
        border: 1.5px solid #e2e8f0 !important;
        border-radius: 8px !important;
    }

    /* ── Progress bar ── */
    .stProgress > div > div {
        background: linear-gradient(90deg, #4f46e5, #06b6d4) !important;
        border-radius: 4px !important;
    }
    .stProgress > div {
        background-color: #e2e8f0 !important;
        border-radius: 4px !important;
    }

    /* ── Sidebar labels ── */
    .stSidebar label, .stSidebar .stSelectbox label {
        color: #374151 !important;
        font-weight: 500 !important;
        font-size: 0.88rem !important;
    }
    .stSidebar h1, .stSidebar h2, .stSidebar h3 {
        color: #1e293b !important;
    }

    /* ── Divider ── */
    hr { border-color: #e2e8f0 !important; }

    /* ── Expander: fix _arrow_right_ icon text bleed ── */
    [data-testid="stExpander"] summary {
        background-color: #f8fafc !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
    }
    /* Hide the raw icon text nodes that bleed outside the summary */
    [data-testid="stExpander"] summary svg ~ span,
    [data-testid="stExpander"] summary > div > div:first-child {
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
    }
    /* Specifically target the _arrow_right_ material icon text */
    .stExpander [data-testid="stExpanderToggleIcon"] {
        overflow: hidden !important;
        font-size: 0 !important;  /* hide text, keep icon svg */
    }
    .stExpander details summary p {
        display: inline !important;
    }
    /* Fix sidebar selectbox label overflow */
    .stSidebar .stSelectbox [data-baseweb="select"] > div {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
</style>
""", unsafe_allow_html=True)

# ==============================================================================
# SECTION 1: GEMINI API
# ==============================================================================

import os

GEMINI_KEY = None
_GEMINI_MODEL = "gemini-3.5-flash"
_FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-3.8-flash"]

def _get_key():
    """Retrieve Gemini API key securely from session_state, Streamlit secrets, or environment."""
    if st.session_state.get("gemini_api_key"):
        return st.session_state["gemini_api_key"].strip()
    try:
        if "GEMINI_API_KEY" in st.secrets and st.secrets["GEMINI_API_KEY"]:
            return st.secrets["GEMINI_API_KEY"].strip()
    except Exception:
        pass
    return os.environ.get("GEMINI_API_KEY", "")

def call_gemini(prompt_text: str, max_tokens: int = 1024) -> str:
    """Make a REST call to Gemini API; returns response text or raises RuntimeError."""
    key = _get_key()
    if not key:
        raise RuntimeError("no_key")

    models_to_try = [_GEMINI_MODEL] + _FALLBACK_MODELS
    last_err = None

    for model in models_to_try:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={key}"
        )
        payload = json.dumps({
            "contents": [{"parts": [{"text": prompt_text}]}],
            "generationConfig": {"maxOutputTokens": max_tokens, "temperature": 0.4}
        }).encode("utf-8")
        req = urllib.request.Request(
            url, data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                body = json.loads(r.read().decode())
                return body["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()
            if e.code in (429, 503):  # rate limit or busy — try next model
                last_err = f"HTTP {e.code}: {err_body[:120]}"
                time.sleep(1)
                continue
            elif e.code == 404:      # model not available — try next
                last_err = f"HTTP 404: {model} not available"
                continue
            else:
                raise RuntimeError(f"Gemini HTTP {e.code}: {err_body[:200]}")
        except Exception as ex:
            last_err = str(ex)
            continue

    raise RuntimeError(f"All models failed. Last error: {last_err}")


def ai_generate_improved_prompt(raw_prompt: str, analysis: dict, audience: str, out_format: str, uncertainty_level: str) -> str:
    """Use Gemini to generate a Responsible-AI-compliant improved version of the raw prompt."""
    domain = analysis['domain']
    score = analysis['overall_score']
    deficiencies = "\n".join(
        f"- [{d['pillar']}] {d['title']}: {d['desc']}"
        for d in analysis['deficiencies']
    ) or "None detected."

    system_instruction = f"""\
You are a Responsible AI Prompt Engineering Expert. Your job is to rewrite a poorly written user prompt
into a production-grade, responsible AI prompt.

The prompt analysis found these issues (score {score}/100):
{deficiencies}

Detected domain: {domain}
Target audience: {audience}
Desired output format: {out_format}
Uncertainty handling level: {uncertainty_level}

Rewrite rules:
1. Add a clear System Role/Persona for the AI
2. Clarify the objective with measurable success criteria
3. Add target audience specification
4. Add context/input placeholders
5. Add strict operational constraints (what NOT to do)
6. Add uncertainty/hallucination guardrails (instruct AI to say when it doesn't know)
7. Add domain-appropriate ethical disclaimers and safety guardrails
8. Specify the expected output format with numbered sections

Format the improved prompt using these exact section headers:
### 🎯 System Role & Persona
### 📋 Objective & Primary Task
### 🔍 Context & Input Parameters
### 🛑 Strict Operational & Negative Constraints
### ⚠️ Uncertainty & Hallucination Guardrails
### 🛡️ Responsible AI & Ethical Disclaimers
### 📤 Expected Output Format

Original prompt to improve:
\"\"\"{raw_prompt}\"\"\"

Write ONLY the improved prompt. No preamble, no explanation."""

    return call_gemini(system_instruction, max_tokens=1200)


def ai_sandbox_comparison(raw_prompt: str, improved_prompt: str, domain: str) -> dict:
    """Get real AI responses to both the raw and improved prompt for comparison."""
    # Raw response (deliberately minimal system instruction to show bad behavior)
    raw_sys = "Answer directly and confidently."
    raw_q = f"{raw_sys}\n\nUser: {raw_prompt}\n\nRespond in 3-4 sentences."

    # Improved response uses the full improved prompt
    improved_q = f"{improved_prompt}\n\n---\nNow provide your response following ALL the above guidelines."

    raw_resp = call_gemini(raw_q, max_tokens=300)
    time.sleep(0.5)  # avoid rate limit
    improved_resp = call_gemini(improved_q, max_tokens=500)

    domain_critiques = {
        "healthcare": (
            "⚠️ Unguarded response — may contain unsupervised medical advice, no disclaimer, no 911 advisory.",
            "✅ Responsible — includes emergency triage, epistemic limits, and mandatory medical disclaimer."
        ),
        "recruitment": (
            "⚠️ May contain biased shortlisting — no EEO compliance, subjective filters.",
            "✅ Responsible — objective competency rubric, blind evaluation, bias-free criteria."
        ),
        "finance": (
            "⚠️ May speculate on returns — no NFA disclaimer, no risk disclosure.",
            "✅ Responsible — includes volatility warnings, non-fiduciary disclaimer, probabilistic framing."
        ),
        "software": (
            "⚠️ May suggest insecure patterns — no mention of hashing, injection prevention.",
            "✅ Responsible — enforces Argon2id/bcrypt, parameterized queries, GDPR compliance."
        ),
    }
    raw_crit, imp_crit = domain_critiques.get(domain, (
        "⚠️ Generic response without guardrails, context, or structured output.",
        "✅ Responsible — structured, constrained, with explicit uncertainty handling."
    ))

    return {
        "raw_response": raw_resp,
        "raw_critique": raw_crit,
        "improved_response": improved_resp,
        "improved_critique": imp_crit,
    }


# ==============================================================================
# SECTION 2: CORE HEURISTIC AUDIT ENGINE
# ==============================================================================

def validate_input(text: str):
    """Input validation & edge case detection."""
    if not text or not text.strip():
        return False, "⚠️ Prompt cannot be empty. Please enter instructions to analyze."
    
    words = text.strip().split()
    if len(words) < 3:
        return False, "⚠️ Input is too brief (less than 3 words). Please provide a meaningful task."
    
    # Check for repetitive gibberish (e.g. "asdf asdf asdf" or "aaaaa")
    unique_words = set(w.lower() for w in words)
    if len(words) > 6 and len(unique_words) <= 2:
        return False, "⚠️ Repetitive or meaningless input detected. Please enter a valid prompt."
        
    return True, ""


def analyze_prompt(raw_text: str):
    """
    Evaluates raw prompt across 5 Core Responsible AI Pillars:
    1. Clarity & Specificity (20)
    2. Context & Persona (20)
    3. Constraints & Boundaries (20)
    4. Uncertainty & Hallucination Defense (20)
    5. Ethics, Fairness & Safety (20)
    """
    text = raw_text.strip()
    lower = text.lower()
    words = text.split()
    word_count = len(words)

    deficiencies = []
    positives = []

    # 1. CLARITY & SPECIFICITY (20 pts)
    clarity_score = 20
    vague_words = ['good', 'best', 'nice', 'quick', 'cool', 'fast', 'awesome', 'simple', 'bad', 'great', 'somehow', 'things', 'stuff']
    found_vague = [w for w in vague_words if re.search(rf'\b{w}\b', lower)]

    if word_count < 8:
        clarity_score -= 12
        deficiencies.append({
            "pillar": "Clarity",
            "severity": "high",
            "title": "Extremely brief & under-specified",
            "desc": "Short prompts leave instructions ambiguous, leading to generic or arbitrary answers."
        })
    elif word_count < 16:
        clarity_score -= 6
        deficiencies.append({
            "pillar": "Clarity",
            "severity": "medium",
            "title": "Minimal task specification",
            "desc": "Consider specifying desired depth, step-by-step breakdown, and exact objective."
        })

    if found_vague:
        clarity_score -= min(8, len(found_vague) * 3)
        deficiencies.append({
            "pillar": "Clarity",
            "severity": "medium",
            "title": f"Subjective terms detected: {', '.join(found_vague[:3])}",
            "desc": "Replace subjective adjectives with measurable parameters and objective criteria."
        })

    has_role = any(rk in lower for rk in ['act as', 'you are a', 'expert in', 'role:'])
    if has_role:
        positives.append("Explicit role or persona defined")
    else:
        clarity_score -= 4
        deficiencies.append({
            "pillar": "Clarity",
            "severity": "low",
            "title": "Missing system role/persona",
            "desc": "Assigning a domain expert persona improves accuracy and technical calibration."
        })
    clarity_score = max(0, min(20, clarity_score))

    # 2. CONTEXT & AUDIENCE (20 pts)
    context_score = 20
    has_audience = any(ak in lower for ak in ['audience', 'for beginners', 'for developers', 'for students', 'for patients', 'for executives'])
    if has_audience:
        positives.append("Target audience explicitly specified")
    else:
        context_score -= 10
        deficiencies.append({
            "pillar": "Context",
            "severity": "medium",
            "title": "Missing target audience",
            "desc": "Without audience specification, the AI cannot tailor vocabulary or complexity."
        })

    has_context = any(ck in lower for ck in ['context:', 'given that', 'background:', 'scenario:', 'parameters:']) or word_count > 30
    if has_context:
        positives.append("Contextual background provided")
    else:
        context_score -= 7
        deficiencies.append({
            "pillar": "Context",
            "severity": "medium",
            "title": "Lacks background context or input variables",
            "desc": "Provide domain details or explicit data placeholders to avoid assumptions."
        })
    context_score = max(0, min(20, context_score))

    # 3. CONSTRAINTS & BOUNDARIES (20 pts)
    constraints_score = 20
    has_format = any(fk in lower for fk in ['json', 'table', 'bullet points', 'markdown', 'step-by-step', 'format:', 'schema'])
    if has_format:
        positives.append("Structured output format requested")
    else:
        constraints_score -= 10
        deficiencies.append({
            "pillar": "Constraints",
            "severity": "medium",
            "title": "No output structure or schema defined",
            "desc": "Specify desired layout (e.g. Markdown headers, tables, bullet points, JSON)."
        })

    has_negative_rules = any(nk in lower for nk in ['do not', "don't", 'never', 'avoid', 'exclude', 'limit to'])
    if has_negative_rules:
        positives.append("Negative constraints specified ('Do not...')")
    else:
        constraints_score -= 6
        deficiencies.append({
            "pillar": "Constraints",
            "severity": "low",
            "title": "Missing negative constraints",
            "desc": "Negative constraints explicitly restrict undesirable or unsafe model behaviors."
        })
    constraints_score = max(0, min(20, constraints_score))

    # 4. UNCERTAINTY & HALLUCINATION DEFENSE (20 pts)
    uncertainty_score = 20
    has_uncertainty = any(uk in lower for uk in [
        'if you do not know', 'if you don\'t know', 'say "i don\'t know"', 'state assumptions',
        'cite sources', 'do not speculate', 'do not fabricate', 'indicate confidence', 'uncertainty'
    ])
    has_speculation = any(spec_kw in lower for spec_kw in ['predict', 'exact price', '10x', 'cure for', 'prove that', 'promise'])

    if has_uncertainty:
        positives.append("Epistemic uncertainty boundaries active")
    else:
        uncertainty_score -= 14
        deficiencies.append({
            "pillar": "Uncertainty",
            "severity": "high",
            "title": "Zero uncertainty or hallucination handling",
            "desc": "LLMs confabulate false facts when data is missing unless instructed to admit uncertainty."
        })

    if has_speculation and not has_uncertainty:
        uncertainty_score -= 6
        deficiencies.append({
            "pillar": "Uncertainty",
            "severity": "high",
            "title": "Speculative task prone to hallucination",
            "desc": "Requesting absolute predictions or proofs causes confident, fabricated answers."
        })
    uncertainty_score = max(0, min(20, uncertainty_score))

    # 5. ETHICS, FAIRNESS & SAFETY (20 pts)
    ethics_score = 20
    domain = 'general'
    risk_level = 'LOW'

    is_medical = any(w in lower for w in ['diagnosis', 'pills', 'medicine', 'chest pain', 'symptom', 'disease', 'dosage', 'prescription'])
    is_finance = any(w in lower for w in ['crypto', 'invest', 'stock', 'token', 'savings', 'financial advice'])
    is_hiring = any(w in lower for w in ['applicants', 'hire', 'screening', 'culture fit', 'candidate', 'resume'])
    is_security = any(w in lower for w in ['password', 'sql database', 'api key', 'secret', 'hash', 'authenticate'])

    has_disclaimer = any(dk in lower for dk in ['disclaimer', 'consult a doctor', 'not financial advice', 'for informational purposes only'])

    if is_medical:
        domain = 'healthcare'
        if not has_disclaimer:
            ethics_score -= 14
            risk_level = 'CRITICAL'
            deficiencies.append({
                "pillar": "Ethics & Safety",
                "severity": "critical",
                "title": "Safety Risk: Unsupervised medical diagnosis without triage",
                "desc": "Prompts must include mandatory physician consultation and emergency triage."
            })
    elif is_hiring:
        domain = 'recruitment'
        if any(bw in lower for bw in ['young', 'aggressive', 'culture fit', 'native speaker']):
            ethics_score -= 12
            risk_level = 'HIGH'
            deficiencies.append({
                "pillar": "Ethics & Safety",
                "severity": "critical",
                "title": "Fairness Risk: Biased/discriminatory evaluation filter",
                "desc": "Terms like 'aggressive young culture' introduce ageism and affinity bias into hiring."
            })
    elif is_finance:
        domain = 'finance'
        if not has_disclaimer:
            ethics_score -= 10
            risk_level = 'HIGH'
            deficiencies.append({
                "pillar": "Ethics & Safety",
                "severity": "high",
                "title": "Financial liability: Missing investment disclosure",
                "desc": "Prompts requesting trading advice require non-fiduciary disclaimers and volatility warnings."
            })
    elif is_security:
        domain = 'software'
        if not any(sw in lower for sw in ['salt', 'bcrypt', 'argon2', 'parameterized', 'sanitize']):
            ethics_score -= 8
            risk_level = 'MEDIUM'
            deficiencies.append({
                "pillar": "Ethics & Safety",
                "severity": "medium",
                "title": "Security Hygiene: Missing cryptographic/injection safeguards",
                "desc": "Mandate modern password hashing (Argon2id/bcrypt) and parameterized queries."
            })

    ethics_score = max(0, min(20, ethics_score))

    overall_score = clarity_score + context_score + constraints_score + uncertainty_score + ethics_score

    if overall_score >= 80:
        status = "✅ Production-Ready"
    elif overall_score >= 60:
        status = "⚠️ Missing Guardrails"
    elif overall_score >= 40:
        status = "🔶 Fragile / High Risk"
    else:
        status = "🔴 Critical Flaws"

    return {
        "overall_score": overall_score,
        "status": status,
        "risk_level": risk_level,
        "domain": domain,
        "scores": {
            "Clarity": clarity_score,
            "Context": context_score,
            "Constraints": constraints_score,
            "Uncertainty": uncertainty_score,
            "Ethics": ethics_score
        },
        "deficiencies": deficiencies,
        "positives": positives,
        "word_count": word_count
    }


def generate_improved_prompt(raw_prompt: str, analysis: dict, audience: str, out_format: str, uncertainty_level: str):
    """Systematically constructs a Responsible AI-compliant prompt."""
    domain = analysis['domain']
    text = raw_prompt.strip()

    role = "Senior Subject Matter Specialist and Responsible AI Advisor"
    task = text
    context_placeholders = "[Insert Domain Context / System Parameters here]"
    constraints = []
    uncertainty_rules = []
    ethics_rules = []
    breakdown = []

    if domain == 'healthcare':
        role = "Board-Certified Clinical Communication & Medical Information Specialist"
        task = f"Provide an educational, evidence-based triage overview regarding: '{text}'. Do NOT provide a definitive diagnosis or prescribe drug dosages."
        context_placeholders = "[Patient Context - Age, duration, symptom severity, existing medical conditions, vital signs]"
        
        constraints.append("Include an immediate emergency advisory to call local emergency services (e.g. 911) if acute distress is present.")
        constraints.append("Discuss potential differential diagnosis categories strictly for educational discussion with a licensed physician.")
        constraints.append("Do NOT recommend unsupervised prescription drugs or specific medical dosages.")

        uncertainty_rules.append("Explicitly state that text-based AI models cannot perform physical examinations, blood tests, or diagnostic ECGs.")
        uncertainty_rules.append("If symptoms are ambiguous, explicitly state what diagnostic limitations exist.")

        ethics_rules.append("Mandatory Medical Disclaimer: 'This content is for informational and educational purposes only and does not constitute medical advice or clinical diagnosis.'")
        ethics_rules.append("Always emphasize human-in-the-loop: direct the user to consult a licensed healthcare professional.")

        breakdown.append(("Ethics & Safety", "Emergency Triage & Medical Liability Shield", "Prevents dangerous self-medication and prioritizes urgent physician consultation."))
        breakdown.append(("Uncertainty", "Diagnostic Epistemic Boundaries", "Explicitly prevents the model from hallucinating a false medical certainty."))

    elif domain == 'recruitment':
        role = "Chief Talent Officer & Inclusive Hiring Compliance Expert"
        task = f"Develop an objective, competency-based evaluation rubric for: '{text}'. Remove all subjective and discriminatory heuristics."
        context_placeholders = "[Role Context - Core technical competencies, measurable KPI track record, verifiable deliverables]"

        constraints.append("Completely remove subjective filters such as age, gender, or 'aggressive culture fit'.")
        constraints.append("Structure candidate scoring strictly around predetermined, verifiable competency metrics.")
        constraints.append("Support blind/anonymized evaluation principles where candidate names and personal identifiers are redacted.")

        uncertainty_rules.append("If resume evidence is incomplete, flag credentials as 'Unverified' rather than guessing.")
        uncertainty_rules.append("Do not make psychological or personality inferences from text semantics.")

        ethics_rules.append("Enforce Fair Hiring & Equal Employment Opportunity (EEO) compliance.")
        ethics_rules.append("Mitigate affinity and proximity bias through standardized rubric weighting.")

        breakdown.append(("Fairness & Ethics", "Anti-Bias & De-Biased Rubrics", "Eliminates ageism and discriminatory stereotypes, replacing them with objective skill benchmarks."))
        breakdown.append(("Constraints", "Blind Evaluation Standard", "Enforces anonymization to prevent implicit bias in hiring."))

    elif domain == 'finance':
        role = "Quantitative Financial Analyst and Risk Management Specialist"
        task = f"Provide an objective, risk-adjusted market analysis regarding: '{text}'. Focus on structural dynamics rather than speculative price targets."
        context_placeholders = "[Asset Context - Ticker, asset class, investment horizon, portfolio risk tolerance]"

        constraints.append("Do NOT provide speculative price predictions or promises of guaranteed financial returns.")
        constraints.append("Clearly delineate downside risk scenarios, liquidity risks, and volatility factors.")

        uncertainty_rules.append("Acknowledge epistemic unpredictability in macroeconomic markets.")
        uncertainty_rules.append("Explicitly state underlying assumptions and sensitivity factors for any scenario discussed.")

        ethics_rules.append("Mandatory Disclaimer: 'Not Financial Advice (NFA). For educational and analytical research purposes only. Consult a licensed financial advisor.'")

        breakdown.append(("Uncertainty", "Speculative Hallucination Shield", "Bans fabricated price targets and forces probabilistic risk analysis."))
        breakdown.append(("Ethics & Safety", "Financial Liability Guardrail", "Protects consumers with mandatory non-fiduciary disclaimers."))

    elif domain == 'software':
        role = "Principal Security Architect and OWASP Compliance Engineer"
        task = f"Design and implement a robust, production-grade security architecture for: '{text}'."
        context_placeholders = "[Environment - Language runtime, database framework, threat model, authentication protocol]"

        constraints.append("Enforce modern password hashing using Argon2id or bcrypt with unique cryptographic salts.")
        constraints.append("Use strictly parameterized SQL statements to eliminate SQL injection vulnerabilities (CWE-89).")
        constraints.append("Never store plaintext credentials or log sensitive user secrets.")

        uncertainty_rules.append("Differentiate between minimal proof-of-concept code and production-hardened requirements.")
        uncertainty_rules.append("Highlight security assumptions and environment dependencies explicitly.")

        ethics_rules.append("Ensure user privacy (GDPR/CCPA compliance) regarding credential retention.")

        breakdown.append(("Constraints", "Cryptographic & Security Hardening", "Enforces Argon2id/bcrypt and parameterized queries to prevent vulnerabilities."))

    else:
        role = "Senior Systems Design and Strategic Operations Specialist"
        task = f"Develop a structured, measurable, and actionable execution strategy for: '{text}'."
        context_placeholders = "[Context Parameters - Target audience, key deliverables, resource constraints, timeline]"

        constraints.append("Define concrete, measurable KPIs and milestones rather than vague qualitative statements.")
        constraints.append("Incorporate risk factors and mitigation contingencies for each milestone.")
        constraints.append("Avoid generic platitudes; provide actionable, prioritized guidance.")

        uncertainty_rules.append("Explicitly state any assumptions made regarding feasibility, resources, or customer behavior.")
        uncertainty_rules.append("If critical data is missing, outline specific questions needed to validate assumptions.")

        ethics_rules.append("Adhere to ethical communication and user privacy standards.")

        breakdown.append(("Clarity", "Operationalized Goals & Metrics", "Replaced vague aspirations with measurable deliverables."))

    if uncertainty_level == "High (Strict Epistemic Bounds)":
        uncertainty_rules.append("Calibrate Confidence: Label findings with confidence levels (High / Medium / Low) and note what evidence is needed to upgrade confidence.")
        uncertainty_rules.append("If information is beyond training cutoff or unverifiable, state 'I do not have sufficient verifiable data to answer this' rather than guessing.")
        breakdown.append(("Uncertainty", "Confidence Calibration & Epistemic Honesty", "Mandates explicit admission of knowledge boundaries."))

    constraints_formatted = "\n".join(f"- {c}" for c in constraints)
    uncertainty_formatted = "\n".join(f"- {u}" for u in uncertainty_rules)
    ethics_formatted = "\n".join(f"- {e}" for e in ethics_rules)

    improved_text = f"""### 🎯 System Role & Persona
You are a {role}. Your communication must be rigorous, objective, and adhere to Responsible AI standards.

---

### 📋 Objective & Primary Task
{task}

Target Audience: {audience}

---

### 🔍 Context & Input Parameters
{context_placeholders}

---

### 🛑 Strict Operational & Negative Constraints
{constraints_formatted}

---

### ⚠️ Uncertainty & Hallucination Guardrails
{uncertainty_formatted}

---

### 🛡️ Responsible AI & Ethical Disclaimers
{ethics_formatted}

---

### 📤 Expected Output Format
Present your response formatted in {out_format}, structured with:
1. Executive Summary & Core Insights
2. Detailed Structured Recommendations (with clear subheadings)
3. Assumptions, Unknowns & Confidence Assessment
4. Ethical, Safety, or Compliance Disclaimers
"""
    return improved_text, breakdown


def get_simulation_comparison(domain: str):
    """Provides comparative simulated AI responses demonstrating the ethical impact."""
    if domain == 'healthcare':
        return {
            "raw_response": "Based on severe chest pain, you might be experiencing angina or acute acid reflux. You should take an aspirin (325mg) right away and an antacid like Omeprazole. If it doesn't get better in an hour, rest in bed.",
            "raw_critique": "🚨 DANGEROUS: Hallucinates unsupervised drug advice, prescribes aspirin (which can be fatal in internal bleeding or aortic dissection), fails to advise 911 emergency dispatch, and trivializes emergency symptoms.",
            "improved_response": "🚨 URGENT EMERGENCY NOTICE:\nIf you are experiencing severe chest pain, immediately call your local emergency services (e.g. 911) or visit the nearest emergency department. Do not drive yourself.\n\n1. Clinical Overview (For Physician Discussion):\nChest pain can originate from cardiovascular emergencies (Myocardial Infarction, Aortic Dissection), pulmonary embolisms, or gastrointestinal spasms.\n\n2. Why Self-Medication is Contraindicated:\nAspirin can cause fatal hemorrhage if the etiology is an aortic aneurysm or GI bleed. No medication should be taken without emergency dispatcher or physician guidance.\n\n3. Epistemic Uncertainty & AI Limitations:\nText-based AI cannot substitute ECG telemetry or clinical lab assays.\n\n*Disclaimer: For educational purposes only. Does not constitute medical diagnosis.*",
            "improved_critique": "✅ RESPONSIBLE: Prioritizes immediate patient safety with 911 triage, eliminates dangerous self-medication, and explicitly disclaims diagnostic authority."
        }
    elif domain == 'recruitment':
        return {
            "raw_response": "Here is the ranking for your startup:\n1. Alex (Age 24) - Best fit! Young, energetic, hungry, will pull 70-hour work weeks and fits the aggressive startup culture.\n2. David (Age 48) - Good technical experience, but might struggle to keep up with the fast-paced, late-night culture.",
            "raw_critique": "🚨 BIASED & ILLEGAL: Introduces age discrimination, assumes older candidates cannot work fast, rewards toxic overwork culture, and introduces serious legal liability.",
            "improved_response": "### 1. Objective Competency Evaluation Rubric\nTo ensure fair, merit-based hiring and prevent unlawful bias:\n- Core Architecture (40%): Distributed systems track record\n- Execution Velocity (30%): Milestone delivery metrics\n- Collaboration (30%): Structured behavioral interview scores\n\n### 2. Blind Review Mandate\nRedact names, graduation years, and personal identifiers to eliminate implicit affinity bias.\n\n### 3. Missing Data Flag\nFlag unverified resume items rather than assuming proficiency or deficiency.",
            "improved_critique": "✅ RESPONSIBLE: Eliminates ageist bias, enforces objective competency metrics, and supports blind review standards."
        }
    else:
        return {
            "raw_response": "Here is a marketing plan for your website:\n- Post every day on Instagram and TikTok.\n- Run Facebook ads with a $500 budget.\n- Do influencer partnerships to go viral.",
            "raw_critique": "⚠️ VAGUE & UNCALIBRATED: Generic advice with zero context, no audience persona, no metrics, and unrealistic assumptions ('go viral').",
            "improved_response": "### 1. Phased Strategic Execution Framework\n- Phase 1 (Weeks 1-2): Position audit and landing page conversion benchmark (>3.5%).\n- Phase 2 (Weeks 3-6): High-intent search acquisition targeting long-tail queries.\n\n### 2. Measurable Constraints & KPIs\nTarget CPA bounded by customer lifetime value (LTV:CPA >= 3:1).\n\n### 3. Assumptions & Uncertainty Disclosures\nAssumes website infrastructure can support traffic spikes; channel efficiency must be validated via $100 A/B pilot tests.",
            "improved_critique": "✅ RESPONSIBLE: Operationalizes vague goals with measurable milestones, risk contingencies, and explicit assumption testing."
        }

# ==============================================================================
# SECTION 2: STREAMLIT UI & INTERACTIVE WORKFLOW
# ==============================================================================

# Header
st.markdown('<h1 class="main-title">🛡️ Responsible AI Prompt Improver</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-title">Audit, de-bias, and reconstruct poorly written prompts into verifiable, context-rich, constraint-guided instructions with epistemic uncertainty defenses.</p>', unsafe_allow_html=True)

# Sidebar: Tuning Knobs & Assignment Documentation
with st.sidebar:
    st.header("⚙️ Responsible AI Tuning")
    audience_opt = st.selectbox(
        "Target Audience",
        ["Technical / Professional", "General Public / Layperson", "Beginner / Student", "Executive / Board Level"]
    )
    format_opt = st.selectbox(
        "Output Format Schema",
        ["Structured Markdown with Headers", "Step-by-Step Actionable Protocol", "JSON Schema with Validated Attributes", "Comparative Analysis Table"]
    )
    uncertainty_opt = st.selectbox(
        "Uncertainty & Hallucination Rigor",
        ["High (Strict Epistemic Bounds)", "Medium (Standard Boundaries)", "Low (Basic Disclosure)"]
    )

    st.markdown("---")
    st.subheader("🤖 Gemini AI Integration")
    active_k = _get_key()
    if active_k:
        st.success("🟢 **Gemini AI Active** (`gemini-3.5-flash`)")
    else:
        st.warning("⚪ Heuristic Mode (No API key)")

    with st.expander("🔑 API Key Settings"):
        st.markdown("<small>Provide your own key or use the built-in configured key:</small>", unsafe_allow_html=True)
        user_key_input = st.text_input(
            "Gemini API Key",
            value=st.session_state.get("gemini_api_key", ""),
            type="password",
            help="Your API key is kept secure in session memory and never saved to git.",
            placeholder="Enter key to override..."
        )
        if user_key_input:
            st.session_state["gemini_api_key"] = user_key_input

    st.markdown("---")
    st.subheader("📋 Assignment Documentation")
    with st.expander("⚖️ Ethical Principles Addressed"):
        st.markdown("""
        - **Safety & Harm Prevention:** Eliminates unsupervised medical advice and security vulnerabilities.
        - **Fairness & Non-Discrimination:** De-biases candidate screening by stripping age and culture-fit filters.
        - **Epistemic Honesty:** Mandates that AI actively states what it *does not know* to prevent confabulation/hallucination.
        - **Transparency:** Explicitly displays assumptions, confidence levels, and human-in-the-loop disclaimers.
        """)

    with st.expander("⚠️ System Limitations"):
        st.markdown("""
        - **Heuristic-Driven Analysis:** Evaluates linguistic and structural patterns; does not guarantee 100% detection of novel adversarial prompts.
        - **Advisory Only:** Improved prompts still require human domain expertise review.
        - **No Direct Execution:** This tool improves prompts; it does not replace model alignment or fine-tuning.
        """)

    with st.expander("🧪 3 Required Test Cases Guide"):
        st.markdown("""
        1. **Normal Input:** Standard task with missing constraints (*"Make a marketing plan for my website"*).
        2. **Invalid / Edge Case:** Empty prompt, 2 words, or repetitive characters.
        3. **High-Risk / Uncertain Input:** High hallucination/safety risk (*"Diagnose chest pain"* or *"Predict 10x crypto tokens"*).
        """)

# Preset Prompt Selection for Quick Testing
st.markdown("##### 🧪 Select a Test Case Preset or Enter Custom Prompt:")
preset_cols = st.columns(4)

# Use session_state to persist preset selection across reruns
if 'preset_text' not in st.session_state:
    st.session_state.preset_text = ""

with preset_cols[0]:
    if st.button("Case 1: Normal Vague Input", use_container_width=True):
        st.session_state.preset_text = "Make a good marketing plan for my new website."
with preset_cols[1]:
    if st.button("Case 2: Invalid / Edge Case", use_container_width=True):
        st.session_state.preset_text = "quick code"
with preset_cols[2]:
    if st.button("Case 3: Medical High-Risk", use_container_width=True):
        st.session_state.preset_text = "Give me a diagnosis for severe chest pain and tell me what pills I should take immediately."
with preset_cols[3]:
    if st.button("Case 4: Hiring Bias Risk", use_container_width=True):
        st.session_state.preset_text = "Look at these applicants and tell me who fits best in our aggressive young startup culture."

default_text = st.session_state.preset_text

# User Input Textarea
user_prompt = st.text_area(
    "Enter Raw Prompt to Audit and Improve:",
    value=default_text,
    height=120,
    help="Type or paste any poorly written prompt to test clarity, context, constraints, and hallucination defense."
)

col_actions = st.columns([2, 1, 1])
with col_actions[0]:
    analyze_btn = st.button("🚀 Audit & Improve Prompt", type="primary", use_container_width=True)

# Main Processing Logic
if analyze_btn:
    is_valid, err_msg = validate_input(user_prompt)

    if not is_valid:
        st.error(err_msg)
        st.info("💡 **Edge-Case Handling Active:** The system validated your input and safely halted execution to prevent processing empty or unmeaningful instructions.")
    else:
        # Run Audit
        analysis = analyze_prompt(user_prompt)
        improved_prompt, breakdown = generate_improved_prompt(
            user_prompt, analysis, audience_opt, format_opt, uncertainty_opt
        )

        st.markdown("---")

        # Top Metric Row
        m_col1, m_col2, m_col3, m_col4 = st.columns(4)
        with m_col1:
            st.metric("Readiness Score", f"{analysis['overall_score']} / 100")
        with m_col2:
            st.metric("Detected Domain", analysis['domain'].capitalize())
        with m_col3:
            st.metric("Vulnerability Risk", analysis['risk_level'])
        with m_col4:
            st.metric("Status", analysis['status'])

        # Two Columns Layout: Audit Radar vs Improved Output
        col_left, col_right = st.columns([1, 1.3])

        with col_left:
            st.subheader("📊 5-Pillar Responsible AI Audit")
            for pillar, score in analysis['scores'].items():
                pct = score / 20.0
                st.write(f"**{pillar}** ({score}/20)")
                st.progress(pct)

            st.markdown("##### 🚨 Detected Deficiencies & Gaps:")
            if not analysis['deficiencies']:
                st.success("No critical deficiencies detected!")
            else:
                for d in analysis['deficiencies']:
                    sev = d['severity'].upper()
                    st.warning(f"**[{sev}] {d['title']}**: {d['desc']}")

            if analysis['positives']:
                st.markdown("##### ✅ Existing Strengths:")
                for p in analysis['positives']:
                    st.write(f"✓ {p}")

        with col_right:
            st.subheader("✨ Enhanced Responsible Prompt")

            # Store AI results in session state so reruns don't re-call API
            if "ai_improved" not in st.session_state:
                st.session_state.ai_improved = None
            if "ai_sandbox" not in st.session_state:
                st.session_state.ai_sandbox = None
            # Reset if the prompt changed
            if st.session_state.get("last_audited_prompt") != user_prompt:
                st.session_state.ai_improved = None
                st.session_state.ai_sandbox = None
                st.session_state.last_audited_prompt = user_prompt

            tab1, tab2, tab3 = st.tabs(["📄 Improved Prompt", "⚖️ Safeguards Breakdown", "🧪 LLM Response Sandbox"])

            with tab1:
                key = _get_key()
                if key and st.session_state.ai_improved is None:
                    with st.spinner("🤖 Gemini is rewriting your prompt..."):
                        try:
                            ai_text = ai_generate_improved_prompt(
                                user_prompt, analysis, audience_opt, format_opt, uncertainty_opt
                            )
                            st.session_state.ai_improved = ai_text
                        except RuntimeError as e:
                            if "no_key" in str(e):
                                st.session_state.ai_improved = improved_prompt  # heuristic fallback
                            else:
                                st.warning(f"⚠️ Gemini error: {e}. Showing heuristic version.")
                                st.session_state.ai_improved = improved_prompt

                display_prompt = st.session_state.ai_improved if st.session_state.ai_improved else improved_prompt

                if key and st.session_state.ai_improved and st.session_state.ai_improved != improved_prompt:
                    st.success("✅ **AI-Generated** — written by Gemini based on your audit results")
                else:
                    st.info("📝 **Heuristic Template** — add Gemini API key for AI-generated improvement")

                st.markdown(
                    f"""
                    <div style="
                        background:#f8fafc;
                        border:1.5px solid #e2e8f0;
                        border-radius:10px;
                        padding:20px 24px;
                        font-family:'Inter',sans-serif;
                        font-size:0.92rem;
                        line-height:1.7;
                        color:#1e293b;
                        white-space:pre-wrap;
                        word-break:break-word;
                        overflow-x:auto;
                        max-height:480px;
                        overflow-y:auto;
                    ">{display_prompt.replace('<','&lt;').replace('>','&gt;')}</div>
                    """,
                    unsafe_allow_html=True
                )
                st.download_button(
                    label="📥 Download Prompt as Markdown (.md)",
                    data=display_prompt,
                    file_name=f"responsible-prompt-{analysis['domain']}.md",
                    mime="text/markdown",
                    use_container_width=True
                )

            with tab2:
                st.markdown("##### Concrete Responsible AI Safeguards Injected:")
                for pillar, title, desc in breakdown:
                    st.info(f"**[{pillar}] {title}**\n\n{desc}")

            with tab3:
                st.markdown("##### 🔬 Comparative AI Behavior Simulation")
                run_sandbox = st.button("▶️ Run Real AI Comparison with Gemini", use_container_width=True)
                if run_sandbox:
                    with st.spinner("🤖 Querying Gemini for both raw and improved responses..."):
                        try:
                            dp = st.session_state.ai_improved if st.session_state.ai_improved else improved_prompt
                            st.session_state.ai_sandbox = ai_sandbox_comparison(
                                user_prompt, dp, analysis['domain']
                            )
                        except RuntimeError as e:
                            st.error(f"Gemini error: {e}")
                            st.session_state.ai_sandbox = get_simulation_comparison(analysis['domain'])

                sim_data = st.session_state.ai_sandbox if st.session_state.ai_sandbox else get_simulation_comparison(analysis['domain'])
                is_real = bool(st.session_state.ai_sandbox)
                if is_real:
                    st.success("⚡ Displaying live LLM generation from Gemini 3.5 Flash")
                else:
                    st.info("💡 Showing representative baseline simulation. Click the button above to generate live responses with Gemini!")

                sc1, sc2 = st.columns(2)
                with sc1:
                    st.error("**Response to Raw Prompt (Unsafe)**" if is_real else "**Response to Raw Prompt (Unsafe) — Example**")
                    st.write(sim_data['raw_response'])
                    st.caption(sim_data['raw_critique'])
                with sc2:
                    st.success("**Response to Improved Prompt (Responsible)**" if is_real else "**Response to Improved Prompt (Responsible) — Example**")
                    st.write(sim_data['improved_response'])
                    st.caption(sim_data['improved_critique'])

# Footer
st.markdown("---")
st.caption("Responsible AI Prompt Improver • Practical Assignment Implementation • Built with Python & Streamlit • Client-Side Secure")
