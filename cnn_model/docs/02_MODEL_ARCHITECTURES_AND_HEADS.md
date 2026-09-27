# GlowVAI CNN Model Architecture & Neural Network Heads

> **Document:** 02 · **Status:** ✅ Updated September 2026 (Phase 5 implementation)

---

## 1. Architecture Decision: MobileNetV3-Large (not ResNet-50)

> [!IMPORTANT]
> The backbone is **MobileNetV3-Large**. Earlier versions of this documentation described ResNet-50. That decision was reversed. Do not reference ResNet-50 anywhere in product copy, README files, or code comments.

| Property | MobileNetV3-Large ✅ | ResNet-50 ❌ |
|----------|---------------------|-------------|
| Model size | ~14 MB | ~98 MB |
| Mobile NPU support | ✅ ARM Mali, Apple Neural Engine, Qualcomm Hexagon | ❌ Too compute-heavy |
| ImageNet Top-1 | 75.3% | 76.1% |
| Inference (CPU, 224²) | ~25 ms | ~180 ms |
| ONNX export size | ~14 MB | ~98 MB |
| Justification | Mobile-first, real users on mid-range Android phones | Academic benchmark baseline |

---

## 2. Multi-Task Model — `SkinModel`

Defined in [`cnn_model/src/models/heads.py`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/src/models/heads.py):

```
Input Image [B, 3, 224, 224]  (ImageNet-normalised)
       │
       ▼
┌──────────────────────────────────────────────────────┐
│  SkinEncoder (MobileNetV3-Large shared backbone)     │
│  - Pretrained ImageNet weights                       │
│  - 16 Inverted Residual feature blocks               │
│  - Global Average Pooling                            │
│  - Last 2 blocks unfrozen for fine-tuning            │
└──────────────────────────────────────────────────────┘
       │
       ▼  Feature vector [B, 960]
       │
       ├──────────────────────────────┐
       ▼                              ▼
┌──────────────────────┐   ┌──────────────────────────┐
│  SkinTypeHead        │   │  ConcernMultiLabelHead   │
│  Linear(960→256)     │   │  Linear(960→256)         │
│  ReLU + Dropout(0.3) │   │  ReLU + Dropout(0.3)     │
│  Linear(256→4)       │   │  Linear(256→5)           │
└──────────────────────┘   └──────────────────────────┘
       │                              │
       ▼                              ▼
skin_type_logits [B, 4]    concern_logits [B, 5]
(argmax at inference)      (sigmoid > 0.5 at inference)
```

**Single forward pass → both outputs simultaneously.**

---

## 3. Backbone — `SkinEncoder`

Defined in [`cnn_model/src/models/backbone.py`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/src/models/backbone.py):

```python
class SkinEncoder(nn.Module):
    def __init__(self, pretrained: bool = True, unfreeze_last_n_blocks: int = 2):
        super().__init__()
        weights = models.MobileNet_V3_Large_Weights.DEFAULT if pretrained else None
        backbone = models.mobilenet_v3_large(weights=weights)

        self.features = backbone.features   # 16 Inverted Residual blocks
        self.avgpool  = backbone.avgpool
        self.output_features = 960          # MobileNetV3-Large feature dim

        # Freeze everything, then selectively unfreeze last N blocks
        for param in self.features.parameters():
            param.requires_grad = False
        for i in range(len(self.features) - unfreeze_last_n_blocks, len(self.features)):
            for param in self.features[i].parameters():
                param.requires_grad = True

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.avgpool(x)
        return torch.flatten(x, 1)  # → [B, 960]
```

### Unfreezing rationale:
- **Fully frozen backbone** = fast but loses domain adaptation benefit (skin ≠ ImageNet objects)
- **All unfrozen** = overfitting risk on small datasets (~5k–50k images)
- **Last 2 blocks** (default) = ~1.2M trainable params out of 5.4M total (22%) — best balance

---

## 4. Task Heads

### 4.1 SkinTypeHead — 4-class Softmax Classification

```python
class SkinTypeHead(nn.Module):
    def __init__(self, input_dim=960, hidden_dim=256, num_classes=4):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_classes),
        )
```

**Loss:** `CrossEntropyLoss` (implicitly applies softmax)
**Inference:** `argmax(softmax(logits))` → class index

**Labels (canonical order):**
| Index | Class | Meaning |
|-------|-------|---------|
| 0 | `oily` | Excess sebum across multiple zones |
| 1 | `dry` | Insufficient moisture / dehydration |
| 2 | `combination` | Oily T-zone + dry or normal cheeks |
| 3 | `normal` | Balanced across all zones |

---

### 4.2 ConcernMultiLabelHead — 5-label Sigmoid Multi-Label

```python
class ConcernMultiLabelHead(nn.Module):
    def __init__(self, input_dim=960, hidden_dim=256, num_concerns=5):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_concerns),
        )
```

**Loss:** `BCEWithLogitsLoss` (implicitly applies sigmoid per label)
**Inference:** `sigmoid(logits) > 0.5` → binary present/absent per concern

**Why sigmoid not softmax:**
A single face can show oiliness AND redness simultaneously. Softmax forces mutual exclusion — biologically incorrect for skin concerns.

**Labels (canonical order — must match `dataset.py`):**
| Index | Key | Display label |
|-------|-----|---------------|
| 0 | `oiliness` | Oiliness around the T-zone |
| 1 | `dryness` | Dryness or dehydration |
| 2 | `redness` | Visible redness |
| 3 | `uneven_tone` | Uneven-looking skin tone |
| 4 | `visible_blemishes` | Visible blemishes |

---

## 5. Tensor Dimensions Across Full Forward Pass

```
Input                 : [B, 3, 224, 224]
MobileNetV3 blocks    : [B, 960, 7, 7]     (after final inverted residual)
Global Avg Pool       : [B, 960, 1, 1]
Flatten               : [B, 960]
SkinTypeHead Layer 1  : [B, 256]
SkinTypeHead Layer 2  : [B, 4]             → CrossEntropyLoss at training
                                             argmax at inference

ConcernHead Layer 1   : [B, 256]
ConcernHead Layer 2   : [B, 5]             → BCEWithLogitsLoss at training
                                             sigmoid > 0.5 at inference
```

---

## 6. ONNX Export Specification

| Property | Value |
|----------|-------|
| Opset | 13 |
| Input name | `input_image` |
| Input shape | `[1, 3, 224, 224]` float32 |
| Input normalisation | ImageNet mean=[0.485,0.456,0.406] std=[0.229,0.224,0.225] |
| Output 1 | `skin_type_logits` `[1, 4]` float32 |
| Output 2 | `concern_logits` `[1, 5]` float32 |
| Dynamic axes | `batch_size` on all |
| Constant folding | ✅ |

**Export command:**
```bash
python scripts/export_to_onnx.py \
    --checkpoint checkpoints/skin_model_best.pth \
    --output     checkpoints/skin_model.onnx
```

---

## 7. Sanity Checks

Each module includes a standalone sanity check runnable before committing to a full training run:

```bash
python cnn_model/src/models/backbone.py    # Verifies [B, 960] output
python cnn_model/src/models/heads.py       # Verifies [B, 4] and [B, 5] outputs
```
