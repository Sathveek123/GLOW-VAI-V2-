# GlowVAI CNN Model Technical Documentation Suite

Welcome to the comprehensive technical documentation for the **GlowVAI AI Skin Diagnostic CNN Engine**.

This documentation suite provides an end-to-end technical breakdown of the deep learning architecture, dataset preprocessing pipelines, training loss functions, REST API endpoints, React Native frontend integration, empirical codebase audits, and future engineering roadmap.

---

## 📚 Documentation Index

| File | Document Title | Description & Scope |
| :--- | :--- | :--- |
| **[`00_CONSISTENCY_LEDGER.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/00_CONSISTENCY_LEDGER.md)** | Architectural Consistency Ledger | Single source of truth mapping all 21 documents to their architectural status (Phase 6 Shipped vs Legacy vs Aspirational) |
| **[`01_OVERVIEW_AND_ARCHITECTURE.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/01_OVERVIEW_AND_ARCHITECTURE.md)** | System Overview & Architecture | End-to-end system architecture, Mermaid data flow, component interactions, and execution pipeline |
| **[`02_MODEL_ARCHITECTURES_AND_HEADS.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/02_MODEL_ARCHITECTURES_AND_HEADS.md)** | Model Architectures & Heads | ResNet-50 backbone, decoupled `ClassificationHead` & `RegressionHead`, layer math, and tensor dimensions |
| **[`03_DATASET_PIPELINE_AND_TRANSFORMS.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/03_DATASET_PIPELINE_AND_TRANSFORMS.md)** | Dataset Pipeline & Transforms | Fitzpatrick17k, DermNet, SCUT-FBP5500, CelebA scripts, metadata normalization, PyTorch transforms |
| **[`04_TRAINING_LOSSES_AND_EVALUATION.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/04_TRAINING_LOSSES_AND_EVALUATION.md)** | Training, Losses & Evaluation | PyTorch training loops (`train_acne.py`), loss functions ($\mathcal{L}_{\text{CE}}$, Smooth L1, BCE), evaluation metrics |
| **[`05_INFERENCE_ENGINE_AND_API.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/05_INFERENCE_ENGINE_AND_API.md)** | Inference Engine & REST API | `CNNPredictor` singleton, GitHub Release weight auto-download, FastAPI endpoints, ONNX model export |
| **[`06_FRONTEND_INTEGRATION_AND_TELEMETRY.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/06_FRONTEND_INTEGRATION_AND_TELEMETRY.md)** | Frontend & Telemetry Sync | React Native camera UI (`FaceScanScreen`), 4-phase visual scanner, skin report screen, Firestore sync |
| **[`07_EMPIRICAL_AUDIT_POSITIVES_AND_DRAWBACKS.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/07_EMPIRICAL_AUDIT_POSITIVES_AND_DRAWBACKS.md)** | Empirical Audit & Pros/Cons | Empirical audit of implemented features, key system positives/advantages, drawbacks, and limitations |
| **[`08_PRODUCTION_DEPLOYMENT_AND_ROADMAP.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/08_PRODUCTION_DEPLOYMENT_AND_ROADMAP.md)** | Production & Engineering Roadmap | Docker containerization, cloud deployment (Render/AWS), latency benchmarks, MobileNetV3/ONNX roadmap |
| **[`09_DATASET_PREPARATION_SCRIPTS_DEEP_DIVE.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/09_DATASET_PREPARATION_SCRIPTS_DEEP_DIVE.md)** |nrain_acne.py`, `train_skintone.py`), hyperparameters, AdamW optimizer, and checkpoints |
| **[`11_EVALUATION_AND_CONFUSION_MATRICES.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/11_EVALUATION_AND_CONFUSION_MATRICES.md)** | Evaluation & Confusion Matrices | Evaluation scripts (`evaluate_models.py`), 4×4 Acne & 6×6 Fitzpatrick confusion matrices, accuracy, F1-scores |
| **[`12_AUTONOMOUS_CLINICAL_AGENT_AND_TOOLS.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/12_AUTONOMOUS_CLINICAL_AGENT_AND_TOOLS.md)** | Autonomous Clinical Agent & Tools | Multi-step Observation-Action-Reflection agent loop (`backend/ai_consultant.py`), registered tools, 1-click routine |
| **[`13_FIREBASE_AND_TELEMETRY_PIPELINE.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/13_FIREBASE_AND_TELEMETRY_PIPELINE.md)** | Telemetry & Firebase Pipeline | Cloud persistence architecture, Firestore document schemas (`scans`, `users`), security rules, and index specs |
| **[`14_CAMERA_RETICLE_AND_LANDMARK_VISUALIZATION.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/14_CAMERA_RETICLE_AND_LANDMARK_VISUALIZATION.md)** | Viewfinder Reticle & Landmark UI | Reticle geometry, 4 facial landmark overlay dots (T-Zone, Cheeks, Chin), shutter animations, and pulse mechanics |
| **[`15_FAQS_AND_TROUBLESHOOTING_GUIDE.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/15_FAQS_AND_TROUBLESHOOTING_GUIDE.md)** | FAQs & Troubleshooting Guide | Comprehensive developer FAQs, fixing CUDA OOM, unmatched route fixes, CORS setup, and camera permission recovery |
| **[`16_PHASE_1_TO_4_IMPLEMENTATION_COMPLETION.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/16_PHASE_1_TO_4_IMPLEMENTATION_COMPLETION.md)** | Phase 1 to 4 Rebuild Implementation Report | Real-Time Guidance, MediaPipe 468-mesh zone mapping, Classical CV Quality Gating, and Ray-Casting Polygon Skin Segmentation |
| **[`17_GLOWVAI_USER_SKIN_REPORT_SPECIFICATION.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/17_GLOWVAI_USER_SKIN_REPORT_SPECIFICATION.md)** | GlowVAI User Skin Report Specification | Complete user-facing report spec, non-medical language rules, skin balance score formula, and JSON contract |
| **[`18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md)** | Camera Validation Engine & Capture Gate Spec | Real-time camera guidance, priority error resolver, two-step expression check, and Capture-Gate state machine |
| **[`19_FRONTEND_CAMERA_AND_REAL_PHOTO_FLOW.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/19_FRONTEND_CAMERA_AND_REAL_PHOTO_FLOW.md)** | Frontend Camera & Real Photo Flow (v2) | Complete end-to-end scan pipeline, `expo-camera` CameraView implementation, `expo-image-picker` gallery, `photoUri` route-param passing pattern, Sep 2026 fake-image fix, FastAPI integration, and Firestore scan schema |
| **[`20_PHASE5_REAL_TRAINING_PIPELINE.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/20_PHASE5_REAL_TRAINING_PIPELINE.md)** | Phase 5 — Real Training Pipeline | MobileNetV3-Large backbone, multi-task head architecture, person-level split integrity, real training loop (no fabricated metrics), held-out test evaluation with genuine confusion matrices, ONNX export with consistency verification |
| **[`21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md)** | Phase 6 — ONNX Runtime Mobile Integration | Session singleton, fail-loud policy, preprocessing chain (crop→resize→mask→CHW normalise), `ScanAnalysisScreen` real inference wiring, `SkinReportScreen` real result consumption, low-confidence banner, hardware acceleration notes |

---

## ⚡ Quick Navigation Links
- [View System Architecture](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/01_OVERVIEW_AND_ARCHITECTURE.md)
- [View PyTorch Model Code](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/src/models/cnn_model.py)
- [View Inference Predictor](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/src/inference/predictor.py)
- [View FastAPI Server](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/backend/main.py)
- [View Client Model Service](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/services/aiSkinModelService.ts)
