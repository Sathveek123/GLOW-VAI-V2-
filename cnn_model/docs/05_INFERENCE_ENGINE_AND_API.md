# GlowVAI Inference Engine & API

> **Document:** 05 · **Status:** ✅ Updated September 2026 (Phase 6 on-device inference)

---

## 1. Primary Inference Path — On-Device ONNX Runtime (Phase 6)

> [!IMPORTANT]
> The **primary inference path** is on-device via `onnxruntime-react-native`. The FastAPI server is a **secondary/development path** only.

```
[User's phone]
      │
      ▼
imagePreprocessing.ts
  → crop face bounding box
  → resize to 224×224
  → decode PNG → RGB Uint8Array
  → apply skin mask (zero non-skin pixels)
      │
      ▼
skinModelService.ts
  → preprocessToTensor()    [HWC uint8 → CHW float32 → ImageNet normalised]
  → session.run()           [ONNX Runtime InferenceSession]
  → softmax(skin_type_logits) → argmax → skin type
  → sigmoid(concern_logits)  → > 0.5 → concern flags
      │
      ▼
SkinAnalysisResult → SkinReportScreen
```

### Why on-device, not server?
- No photo ever leaves the user's device
- Zero network latency (no API round-trip)
- Works offline
- MobileNetV3-Large at ~14MB is fully practical as an app bundle asset
- No backend hosting cost

---

## 2. On-Device Inference Service — `skinModelService.ts`

Defined in [`src/services/skinModelService.ts`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/services/skinModelService.ts):

### Session Lifecycle
```typescript
// Session created ONCE on first scan, reused across all subsequent scans
let _sessionPromise: Promise<InferenceSession> | null = null;

async function getSession(): Promise<InferenceSession> {
  if (_sessionPromise) return _sessionPromise;
  _sessionPromise = InferenceSession.create(asset.localUri, {
    executionProviders: ['cpu'],  // add 'coreml' / 'nnapi' for hardware acceleration
  });
  return _sessionPromise;
}
```

Creating a new session per scan would add ~800ms–2s cold start. Singleton pattern avoids this.

### Fail Policy
| Condition | Action |
|-----------|--------|
| Model file missing | `throw Error` → `ScanFailedScreen(reason=model_unavailable)` |
| Model < 1 MB | `throw Error` → placeholder/corrupt model refused |
| ONNX Runtime error | Propagates → `ScanFailedScreen(reason=processing_error)` |

**Never silently falls back to fake scores.**

### Preprocessing
```typescript
function preprocessToTensor(rgbPixels: Uint8Array, width=224, height=224): Tensor {
  // HWC uint8 [0–255] → CHW float32 → ImageNet normalised
  const MEAN = [0.485, 0.456, 0.406];
  const STD  = [0.229, 0.224, 0.225];
  const data = new Float32Array(3 * width * height);
  for (let c = 0; c < 3; c++)
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const hwcIdx = (y * width + x) * 3 + c;
        const chwIdx =  c * width * height + y * width + x;
        data[chwIdx] = (rgbPixels[hwcIdx] / 255 - MEAN[c]) / STD[c];
      }
  return new Tensor('float32', data, [1, 3, height, width]);
}
```

### Result Shape
```typescript
interface SkinAnalysisResult {
  scanId: string;
  modelVersion: string;           // 'skin_model_v1_2026'
  status: 'completed' | 'low_confidence' | 'failed';
  confidence: number;             // 0–1 overall
  skinProfile: {
    skinType: 'oily'|'dry'|'combination'|'normal'|'uncertain';
    skinTypeConfidence: number;
    skinTypeProbs: number[];       // [oily, dry, combo, normal]
  };
  concerns: ConcernScore[];        // 5 concerns
  disclaimer: string;
  inferenceMethod: 'onnx_on_device';
  inferenceLatencyMs: number;
}
```

---

## 3. Secondary Path — FastAPI Server (Development / Research)

The [`backend/main.py`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/backend/main.py) FastAPI server is available for local development and research workflows where you want to run inference from a full Python environment rather than the mobile app.

### Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /predict` | POST | Upload face image → returns skin analysis JSON |
| `POST /api/v1/scan/analyze` | POST | Alias for `/predict` |

### Request
```
Content-Type: multipart/form-data
file: <face image JPEG/PNG>
userId: <optional string>
```

### Response Schema
```json
{
  "success": true,
  "scanId": "SCAN-CNN-1726173000000",
  "skinType": "combination",
  "skinTypeConfidence": 0.74,
  "concerns": {
    "oiliness": { "present": true, "score": 0.82 },
    "dryness":  { "present": false, "score": 0.21 },
    "redness":  { "present": false, "score": 0.18 },
    "uneven_tone": { "present": true, "score": 0.61 },
    "visible_blemishes": { "present": false, "score": 0.29 }
  },
  "modelVersion": "skin_model_v1_2026",
  "inferenceLatencyMs": 48
}
```

> [!NOTE]
> The FastAPI backend uses the **same** `skin_model.onnx` file as the mobile app — not a separate PyTorch model. This ensures parity between local dev inference and on-device inference.

---

## 4. ONNX Export Pipeline

```bash
# Run after evaluate.py confirms acceptable test accuracy:
python scripts/export_to_onnx.py \
    --checkpoint checkpoints/skin_model_best.pth \
    --output     checkpoints/skin_model.onnx

# Then copy to mobile app:
cp checkpoints/skin_model.onnx assets/models/skin_model.onnx
```

### Export script does:
1. Loads checkpoint into `SkinModel` (MobileNetV3-Large)
2. Runs `torch.onnx.export()` with opset 13 + dynamic batch axis
3. If `onnxruntime` is installed: runs automatic consistency check (PyTorch vs ORT output, tolerance 1e-4)
4. Writes `skin_model.export_manifest.json` with input/output specs

---

## 5. Hardware Acceleration (Future)

```typescript
// iOS — Core ML
executionProviders: ['coreml', 'cpu']

// Android — NNAPI
executionProviders: ['nnapi', 'cpu']
```

Currently running on `cpu` provider (reliable across all devices). Adding `coreml`/`nnapi` can reduce latency from ~25ms to ~8ms on supported hardware, but requires additional testing for output consistency.
