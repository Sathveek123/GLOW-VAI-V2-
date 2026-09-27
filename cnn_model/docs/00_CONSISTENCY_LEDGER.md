# GlowVAI Architectural Consistency Ledger

> **Document:** 00 · **Updated:** September 2026  
> **Status:** 🟢 Active Reference — Single Source of Truth for Document Statuses & Evolution

---

## 1. Executive Summary

As the GlowVAI codebase evolved from initial theoretical specifications (Phase 1–4) through PyTorch model training (Phase 5) to on-device mobile ONNX Runtime deployment (Phase 6), certain documents describe past iterations, server-side fallbacks, or future aspirational targets.

This ledger defines the exact **Status**, **Ground Truth Level**, and **Architectural Scope** of every document in `cnn_model/docs/` to eliminate contradictions and guide developers.

---

## 2. Document Status & Truth Classification Matrix

| Doc | Document Title | Status | Category | Scope / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **00** | **Consistency Ledger** | 🟢 Active | Ground Truth | Single source of truth for architectural statuses across all documentation |
| **01** | **System Overview & Architecture** | 🟢 Active | System Design | Core system flow & vision |
| **02** | **Model Architectures & Heads** | 🟡 Historical / Transition | Model Spec | Historical reference for ResNet-50. Superceded by MobileNetV3-Large in Phase 5/6 (Doc 20/21) |
| **03** | **Dataset Pipeline & Transforms** | 🟢 Active | Data Pipeline | Preprocessing and dataset normalization specifications |
| **04** | **Training Losses & Evaluation** | 🟢 Active | Training Spec | Loss functions ($\mathcal{L}_{\text{CE}}$, Smooth L1, BCE) and multi-task metrics |
| **05** | **Inference Engine & API** | 🟡 Server Path | Legacy / Server | PyTorch/FastAPI server-side inference pipeline. Primary mobile path is now Phase 6 ONNX (Doc 21) |
| **06** | **Frontend Integration & Telemetry** | 🟢 Active | Frontend UI | React Native scan flow, visual reticle, and Firestore synchronization |
| **07** | **Empirical Audit & Positives/Drawbacks** | 🟢 Active | Audit Ledger | Live implementation completion matrix, known gaps, and pre-production blockers |
| **08** | **Production Deployment & Roadmap** | 🟢 Active | Operations | Containerization, deployment guidelines, and hardware acceleration notes |
| **09** | **Dataset Preparation Scripts** | 🟢 Active | Data Pipeline | CLI dataset normalization & metadata merge tool docs |
| **10** | **Model Training Scripts & Experiments** | 🟢 Active | Training Spec | Historical & training execution specs |
| **11** | **Evaluation & Confusion Matrices** | 🟢 Active | Evaluation | Evaluation harness, confusion matrix generation guidelines |
| **12** | **Autonomous Clinical Agent & Tools** | 🟡 Optional Feature | Agent System | Multi-step agent consultant loop (`ai_consultant.py`) |
| **13** | **Telemetry & Firebase Pipeline** | 🟢 Active | Persistence | Firestore scan schemas and telemetry cloud sync specs |
| **14** | **Viewfinder Reticle & Landmark UI** | 🟢 Active | Frontend UI | Facial landmark visual dots and reticle geometry |
| **15** | **FAQs & Troubleshooting Guide** | 🟢 Active | Developer Guide | Common issues, environment fixes, and resolution steps |
| **16** | **Phase 1 to 4 Implementation Report** | 🟢 Active | Phase Report | MediaPipe 468-mesh, classical CV quality gate, and ray-casting polygon specs |
| **17** | **GlowVAI User Skin Report Specification** | 🔴 Aspirational Spec | Target Spec | Specifies **target** report structure. Current shipped implementation uses `SkinAnalysisResult` (Doc 21) |
| **18** | **Camera Validation & Capture Gate Spec** | 🟡 Partial Implementation | Capture Gate | Quality gate state machine. Expression flow (Priority 15) is specified but not yet wired in RN app |
| **19** | **Frontend Camera & Real Photo Flow** | 🟢 Active (v2) | Frontend Camera | Expo camera capture, picker flow, route-param passing, on-device ONNX inference |
| **20** | **Phase 5 — Real Training Pipeline** | 🟢 Ground Truth | PyTorch Model | **Ground Truth** for model architecture (MobileNetV3-Large), multi-task heads, training loop, & ONNX export |
| **21** | **Phase 6 — ONNX Runtime Mobile Integration** | 🟢 Ground Truth | Mobile Inference | **Ground Truth** for client mobile inference, ONNX Runtime React Native service, and active app wiring |

---

## 3. Architecture Hierarchy & Conflict Resolution Rules

When encountering conflicting specifications across documentation:

1. **Mobile Model Architecture & Inference:** `21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md` and `20_PHASE5_REAL_TRAINING_PIPELINE.md` take precedence over older ResNet-50 / FastAPI server mentions in Docs 02 & 05.
2. **Camera Capture Mechanics:** `19_FRONTEND_CAMERA_AND_REAL_PHOTO_FLOW.md` (v2) and `18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md` take precedence.
3. **Data Schemas & Active Contracts:** `21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md` (for `SkinAnalysisResult`) and `07_EMPIRICAL_AUDIT_POSITIVES_AND_DRAWBACKS.md` take precedence over aspirational target specs in Doc 17.
