# GlowVAI Autonomous Clinical Agent & AI Tools

> **Document:** 12 · **Status:** ✅ Updated September 2026

---

## 1. Current State of the AI Agent

The GlowVAI system uses a **two-layer AI architecture**:

1. **Primary: On-Device ONNX Model** (Phase 6) — MobileNetV3-Large producing skin type + concern outputs. This is the real-time analysis that happens during every scan.

2. **Secondary: AI Dermatologist Agent** (`aiDermatologistAgent.ts`) — A higher-level reasoning layer that interprets model outputs and generates nuanced skincare recommendations. This calls an external LLM API (e.g., Gemini or GPT-4) with the structured scan result as context.

---

## 2. AI Dermatologist Agent — `aiDermatologistAgent.ts`

Defined in [`src/services/aiDermatologistAgent.ts`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/services/aiDermatologistAgent.ts):

### Role
Takes the `SkinAnalysisResult` from Phase 6 inference and generates:
- Personalised cosmetic routine recommendations
- Concern-specific ingredient suggestions
- Morning + evening routine structure
- Product matches from the GlowVAI catalogue

### Input: `SkinAnalysisResult`
```typescript
{
  skinProfile: { skinType: 'combination', skinTypeConfidence: 0.74 },
  concerns: [
    { key: 'oiliness', present: true, severity: 'pronounced' },
    { key: 'uneven_tone', present: true, severity: 'moderate' },
    // ...
  ]
}
```

### Output: Routine recommendation
```typescript
{
  morningRoutine: ['Niacinamide 5% toner', 'SPF 50+ sunscreen'],
  eveningRoutine: ['Salicylic acid 2% cleanser', 'Retinol 0.1% serum'],
  concernIngredients: {
    oiliness: 'Niacinamide, Salicylic Acid, BHA',
    uneven_tone: 'Vitamin C, Tranexamic Acid, AHA',
  },
  products: [/* GlowVAI catalogue items */]
}
```

---

## 3. FastAPI Clinical Tool Endpoints (Development)

The FastAPI backend at `backend/main.py` exposes clinical tool endpoints used in the development/research environment:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/agent/tools` | GET | Lists registered clinical tools and schemas |
| `/api/v1/agent/tool/execute` | POST | Executes: `analyze_face_biometrics`, `match_skincare_routine` |
| `/api/v1/agent/consult` | POST | Runs full Observation-Action-Reflection loop, returns routine |

### Tool: `analyze_face_biometrics`
Takes the ONNX model's `SkinAnalysisResult` JSON and structures it for agent context.

### Tool: `match_skincare_routine`
Matches skin type + present concerns → GlowVAI catalogue products via a rule-based or embedding-based lookup.

### Tool: `match_clinical_skincare_routine`
Extended version: adds ingredient-level reasoning for each detected concern.

---

## 4. Non-Medical Language Policy

> [!IMPORTANT]
> The AI agent **must** use cosmetic language, not clinical/medical language. This is a product policy that applies to all LLM prompts, API responses, and UI copy.

| ❌ Medical (Forbidden) | ✅ Cosmetic (Required) |
|----------------------|----------------------|
| "Acne lesions" | "Visible blemishes" |
| "Hyperpigmentation" | "Uneven-looking skin tone" |
| "Seborrheic dermatitis" | "Oiliness around the T-zone" |
| "Erythema" | "Visible redness" |
| "Stratum corneum dehydration" | "Dryness or dehydration" |
| "Dermatologist recommends" | "Your GlowVAI routine suggests" |
| "Diagnosis" | "Cosmetic skin assessment" |
| "Treatment" | "Routine" |

All LLM system prompts must include an explicit instruction:
```
You are a cosmetic skincare assistant. Use only non-medical language.
Do not diagnose, prescribe, or reference medical conditions.
All recommendations are cosmetic only.
```

---

## 5. Recommendation System Architecture

```
SkinAnalysisResult
    │
    ▼
[aiDermatologistAgent.ts]
    │
    ├── skinType → ingredient filter (e.g., oily → avoid heavy emollients)
    ├── concerns → ingredient recommendations:
    │     oiliness       → Niacinamide, Salicylic Acid
    │     dryness        → Hyaluronic Acid, Ceramides, Squalane
    │     redness        → Centella Asiatica, Azelaic Acid
    │     uneven_tone    → Vitamin C, Tranexamic Acid, AHA
    │     visible_blem.  → Salicylic Acid, BHA, Benzoyl Peroxide (low %)
    │
    └── [catalogue lookup] → GlowVAI products containing these ingredients
             │
             ▼
        SkinReportScreen → "View My Routine" section
```

---

## 6. Confidence Gating for Recommendations

Agent recommendations are gated by model confidence:

| Confidence Level | Recommendation Behaviour |
|-----------------|------------------------|
| ≥ 80% | Full personalised routine for detected skin type |
| 50–80% | Routine shown with "results may vary" note |
| < 50% | Generic routine; prompts retake in better lighting |
| `uncertain` skin type | Concern-only routine (no skin-type-specific products) |
