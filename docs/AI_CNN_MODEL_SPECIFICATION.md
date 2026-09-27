# GlowVAI V2 — AI & CNN Model Technical Specification

## 1. Overview

The **GlowVAI AI Diagnostic Engine** is a multi-task Computer Vision (CV) system powered by PyTorch models located in `cnn_model/` and served via FastAPI in `backend/main.py`. It provides clinical-grade cosmetic skin analysis by extracting biometric surface indicators directly from facial images.

---

## 2. Multi-Task Biometric Classification Architecture

The PyTorch neural network evaluates facial crop tensors across multiple sub-task heads:

| Diagnostic Metric | Output Format / Scale | Biological Parameter Analyzed |
| :--- | :--- | :--- |
| **Acne Severity** | Class 0 (None), 1 (Mild), 2 (Moderate), 3 (Severe) | Inflammatory papules, comedones, follicular congestion |
| **Hydration Index** | Score (0–100 %) | Stratum corneum moisture retention & surface flakiness |
| **Surface Texture** | Score (0–100 %) | Dermal pore topography, micro-roughness |
| **Hyperpigmentation** | Score (0–100 %) | Melanin clustering, sun spot density, PIH marks |
| **Sebum / Lipid Level**| Score (0–100 %) | T-zone shine & follicular permeability |
| **Skin Sensitivity** | Score (0–100 %) | Micro-erythema & skin barrier resilience |
| **Fitzpatrick Skin Tone**| Class 1 to 6 | Melanin tone scale for custom SPF & active recommendations |
| **Portrait Quality Score**| Float (0.0 – 1.0) | Lighting adequacy, focus sharpness, facial alignment |

---

## 3. Computer Vision Inference Pipeline

```
Raw Camera Image / Upload
       │
       ▼
1. Image Preprocessing
   ├── Decoding (JPEG / PNG bytes)
   ├── Aspect ratio resizing (224x224 / 256x256)
   └── Normalization (Mean: [0.485, 0.456, 0.406], Std: [0.229, 0.224, 0.225])
       │
       ▼
2. PyTorch Model Evaluation (CNNPredictor)
   ├── Checkpoint dir: cnn_model/checkpoints/
   ├── Multi-task forward pass
   └── Extraction of raw logits & softmax classification probabilities
       │
       ▼
3. Score Mapping & Metric Formatting
   ├── Acne Class 0 -> 92 (EXCELLENT)
   ├── Acne Class 1 -> 84 (GOOD)
   ├── Acne Class 2 -> 71 (MODERATE)
   └── Acne Class 3 -> 58 (POOR)
       │
       ▼
4. Output JSON Generation (SkinAnalysisResponse)
   └── Returns skinType, overallScore, metrics, detectedConcerns, recommendations
```

---

## 4. Fallback Calibrated Diagnostic Engine

To uphold GlowVAI's **Zero-Crash & Authentic Response Standard**, if a raw image is obstructed, poorly lit, or model checkpoint files are initializing:
- The system executes clinical fallback logic (`backend/main.py`).
- Calculates scores using standard clinical baselines and questionnaire inputs.
- Clearly flags raw output metadata as calibrated, preventing unhandled 500 server crashes.

---

## 5. Autonomous Clinical Dermatologist Agent (`backend/ai_consultant.py`)

The AI engine features an autonomous multi-step clinical consultant implementing an **Observation-Action-Reflection (ReAct)** loop.

### 5.1 Registered Clinical Tools

1. `analyze_face_biometrics`:
   - Computes barrier status (`HEALTHY_RESILIENT` vs `IMPAIRED_TEWL`) and score pulses.
2. `verify_ingredient_contraindications`:
   - Audits active ingredients for pH compatibility, chemical clashes, and safety layering rules.
   - *Example rule*: Flags Retinol + Salicylic Acid layered in the same step.
3. `match_clinical_skincare_routine`:
   - Matches diagnostic scores to verified Indian formulations (Minimalist, Derma Co, etc.).
4. `calculate_express_delivery_eta`:
   - Queries dark store fulfillment hubs for 15–45 min express drop ETAs.

### 5.2 Formulations Database (`INDIAN_CLINICAL_FORMULATIONS`)
Includes detailed active percentages, pH ranges, indications, and contraindications for:
- Minimalist Niacinamide 10% + Zinc 1% (pH 5.5–6.0)
- Minimalist Salicylic Acid 2% (pH 3.5–4.0)
- The Derma Co 1% Kojic Acid Daily Glow Serum (pH 4.5–5.5)
- The Derma Co 4% Ceramide Barrier Repair Cream (pH 5.5)
- The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++ (pH 6.0)

---

## 6. API Endpoints for AI Engine

- `POST /predict` or `POST /api/v1/scan/analyze`: Image upload endpoint for face scan analysis.
- `GET /api/v1/agent/tools`: Lists all registered clinical tools.
- `POST /api/v1/agent/tool/execute`: Direct tool execution endpoint.
- `POST /api/v1/agent/consult`: Full autonomous clinical consultation loop.
