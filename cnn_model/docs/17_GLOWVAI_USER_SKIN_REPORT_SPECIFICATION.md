# GlowVAI User Skin Report Specification

> [!CAUTION]
> **Aspirational Spec — Not the Current Shipped Schema.**
> This document specifies the **target** report structure for a future release. The **currently implemented** `SkinAnalysisResult` (Doc 05, Doc 21) has a simpler shape that does NOT yet include:
> - Zone-level breakdown (7 face zones: forehead, T-zone, cheeks, chin, under-eye) — **not in `SkinAnalysisResult`**
> - `skinBalanceScore` formula — **no such field in the current model output**
> - 4-tier confidence thresholds (0.30/0.59/0.79/0.80) — **current model uses a single 0.5 floor**
> - `imageQuality` sub-object with lighting/sharpness/facePosition scores — **not produced by Phase 5/6 pipeline**
>
> The current shipped schema is in Doc 05 Section 2 (`SkinAnalysisResult` interface) and Doc 13 (Firestore document).
> **Do not build against this document's JSON schema until Doc 05/21 are updated to match, or this document is simplified to match the real output.**
> Reconciling this spec with the shipped implementation is tracked as a Phase 7 roadmap item (see Doc 08 Section 6).

---

## 1. Executive Summary & Governing Principles

The **GlowVAI User Skin Report** translates raw multi-task CNN probabilities, classical CV quality metrics, and landmark zone boundaries into a **cosmetic, non-medical, transparent, and actionable skin profile**.

### Governing Principles:
1. **Cosmetic Guidance Only**: Uses observational terms (*"visible signs of uneven tone"*, *"dry-looking areas"*, *"surface sheen"*) and never medical diagnostic language (*"you have melasma/rosacea/eczema"*).
2. **Absolute Zero Mock Policy**: Confidence scores and quality gates are calibrated. Low confidence ($\le 0.59$) triggers a retake scan prompt rather than presenting unconfident guesses.
3. **Explainable Product Matching**: Every recommended product displays explicit matching rationale tied to skin-type profile, zone observations, and ingredient safety.

---

## 2. Report Screen Structure (Top to Bottom Order)

1. **Report Screen Header**:
   - Title: *"Your Glow Profile"*
   - Subtitle: *"Your personalized cosmetic skin insights"*
   - Scan timestamp and *"Scan completed"* status badge.
   - Quick actions: *Retake Scan*, *Scan History*, *Delete Report*.

2. **Short Disclaimer**:
   - *"This is a cosmetic skin assessment, not a medical diagnosis."*

3. **Overall Scan Summary Card**:
   - Estimated Skin Type (`Combination`, `Dry`, `Oily`, `Normal`, `Uncertain`).
   - Calibrated Confidence Score ($\%$).
   - Primary observation sentence.
   - **Skin Balance Score** ($0\text{--}100$):
     $$\text{SkinBalance} = 100 - \text{drynessPenalty} - \text{oilinessPenalty} - \text{rednessPenalty} - \text{unevenTonePenalty} - \text{texturePenalty}$$

4. **Primary Skin Type Result**:
   - Primary skin-type classification with confidence percentage, simple explanation, and routine implications.

5. **Top Cosmetic Skin Insights**:
   - Display Threshold Logic:
     - $\text{score} < 0.30$: Hidden from primary view.
     - $0.30\text{--}0.59$: *"Mild observation"*
     - $0.60\text{--}0.79$: *"Moderate observation"*
     - $\ge 0.80$: *"Prominent observation"*
   - Categories: `Oiliness`, `Dry-looking areas`, `Uneven-looking skin tone`, `Surface-level redness`, `Visible blemish-like areas`.

6. **Face-Zone Analysis Breakdown**:
   - List-based analysis across 7 clinical face zones: *Forehead*, *Nose (T-Zone)*, *Left cheek*, *Right cheek*, *Chin*, *Left under-eye*, *Right under-eye*.
   - Disclaimer note: *"Highlighted areas represent cosmetic observations from the image. They are not medical diagnoses."*

7. **Scan Quality Report Card**:
   - Reports `Lighting`, `Sharpness`, `Face Position`, `Face Visibility`, and Overall Quality ($\%$).

8. **Personalized Routine (Morning & Night)**:
   - Morning: Step 1 Cleanser, Step 2 Serum, Step 3 Moisturizer, Step 4 Broad-Spectrum Sunscreen.
   - Night: Step 1 Cleanser, Step 2 Barrier Moisturizer.
   - Safety note: *"Introduce one new product at a time and follow product label instructions. Stop use if irritation occurs."*

9. **Explainable Product Recommendations & 1-Click Routine Shop**:
   - Product Cards showing Price, MRP, Discount $\%$, 10-Minute Express Delivery badge, and *"WHY THIS WAS SELECTED"* rationale box.
   - Primary CTA: *"Shop Complete 4-Step Routine"*.

10. **Expandable Technical Details (Model Info)**:
    - Model version tag (`glowvai-skin-cnn-0.1.0`), execution mode (`on_device`), scan ID.

11. **Full Medical Disclaimer**:
    - *"Glow Vai’s AI scan provides cosmetic observations based on the submitted image. It does not diagnose, treat, or prevent medical conditions. Results can vary with lighting, camera quality, makeup, and other factors. For persistent or concerning skin changes, consult a qualified dermatologist."*

---

## 3. Complete Report JSON Schema Contract

```ts
export type UserSkinReport = {
  reportId: string;
  scanId: string;
  createdAt: string;
  modelVersion: string;
  processingMode: "on_device" | "server";
  status: "completed" | "low_confidence" | "rejected";

  summary: {
    title: string;
    description: string;
    skinType: {
      key: "normal" | "dry" | "oily" | "combination" | "uncertain";
      label: string;
      confidence: number;
      explanation: string;
    };
    overallConfidence: number;
    skinBalanceScore?: {
      value: number;
      label: string;
      explanation: string;
    };
  };

  imageQuality: {
    overallScore: number;
    label: "good" | "acceptable" | "needs_improvement";
    lighting: { score: number; label: string };
    sharpness: { score: number; label: string };
    facePosition: { score: number; label: string };
    faceVisibility: { score: number; label: string };
    limitations: string[];
  };

  topInsights: SkinInsight[];
  zones: SkinZoneReport[];
  routine: {
    morning: RoutineStep[];
    night: RoutineStep[];
  };
  recommendedProducts: RecommendedProduct[];
  disclaimers: {
    short: string;
    full: string;
  };
};
```
