# GlowVAI Firebase & Telemetry Pipeline

> **Document:** 13 · **Status:** ✅ Updated September 2026 (Phase 6 scan schema)

---

## 1. Overview

GlowVAI uses Firebase Firestore for scan persistence and user profile management. Telemetry is written **after** real inference completes — it reflects actual model output, not fabricated scores.

---

## 2. Firestore Collections

### `scans` Collection

Each completed scan writes one document to `scans/{scanId}`:

```json
{
  "scanId": "SCAN-1726173000000",
  "userId": "firebase_uid_xyz",
  "modelVersion": "skin_model_v1_2026",
  "inferenceMethod": "onnx_on_device",
  "status": "completed",
  "confidence": 0.74,
  "skinProfile": {
    "skinType": "combination",
    "skinTypeConfidence": 0.74,
    "skinTypeProbs": [0.12, 0.08, 0.74, 0.06]
  },
  "concerns": {
    "oiliness":          { "present": true,  "score": 0.82, "severity": "pronounced", "confidence": 0.64 },
    "dryness":           { "present": false, "score": 0.21, "severity": "mild",       "confidence": 0.58 },
    "redness":           { "present": false, "score": 0.18, "severity": "mild",       "confidence": 0.64 },
    "uneven_tone":       { "present": true,  "score": 0.61, "severity": "moderate",   "confidence": 0.22 },
    "visible_blemishes": { "present": false, "score": 0.29, "severity": "mild",       "confidence": 0.42 }
  },
  "disclaimer": "Cosmetic skin assessment only — not a medical diagnosis.",
  "inferenceLatencyMs": 48,
  "scannedAt": 1726173000000
}
```

### Key fields explained

| Field | Source | Meaning |
|-------|--------|---------|
| `modelVersion` | `skinModelService.ts MODEL_VERSION` | Which model binary ran this scan |
| `inferenceMethod` | Always `"onnx_on_device"` | Real Phase 6 inference path |
| `status` | From `SkinAnalysisResult` | `completed` \| `low_confidence` \| `failed` |
| `skinTypeProbs` | Full softmax distribution | Probability for each of the 4 skin types |
| `concern.confidence` | Distance from 0.5 decision boundary × 2 | 0 = maximally uncertain, 1 = maximally certain |
| `inferenceLatencyMs` | `Date.now()` delta in `runSkinAnalysis` | Actual wall-clock inference time |

---

## 3. `users` Collection Update

When a user completes a scan, `users/{userId}` is updated:

```json
{
  "latestScanId": "SCAN-1726173000000",
  "latestSkinType": "combination",
  "latestScanAt": 1726173000000,
  "totalScans": 3
}
```

This allows instant profile restoration across devices — the report screen can reload the last scan without re-running inference.

---

## 4. Telemetry Service — `telemetryService.ts`

Defined in [`src/services/telemetryService.ts`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/services/telemetryService.ts):

### Write Pattern
All Firestore writes are:
- **Async** — they don't block the UI
- **Best-effort** — a Firestore write failure does not crash the scan flow
- **Structured** — always use `setDoc` with merge, never `updateDoc` with partial fields

```typescript
// After runSkinAnalysis() returns:
await telemetryService.persistScan(result, userId);
// If this throws, log error but don't re-throw — user still sees their result
```

---

## 5. Scan History (Future)

Currently each scan is a standalone document. Future Phase 7 will add:
- `users/{userId}/scans` subcollection for history
- Comparison delta between consecutive scans
- "Skin improvement" tracking over 30/60/90 days

---

## 6. Privacy

- **No image stored**: Only model outputs (skin type, concern scores) are persisted — the face photo stays on device
- **No biometric data**: Scores are cosmetic assessment outputs, not biometric identifiers
- **User-controlled**: User can delete their scan history from Settings → Data & Privacy
