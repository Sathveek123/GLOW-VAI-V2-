"""
GlowVAI Skin Analysis — Task Heads & Full Multi-Task Model (Phase 5)
=====================================================================
Architecture: shared encoder → two task-specific heads in one forward pass.

Tasks:
  1. SkinTypeHead         — 4-class classification (oily/dry/combination/normal)
  2. ConcernMultiLabelHead — 5-label multi-label (oiliness/dryness/redness/
                             uneven_tone/visible_blemishes)

Design rationale:
  - Multi-task single forward pass is more efficient than running two
    separate full models per task (rejected old approach)
  - SkinType uses softmax at loss/inference — exactly one skin type applies
  - Concerns use sigmoid at loss/inference — multiple concerns can co-exist
    (face can show oiliness AND redness simultaneously → not mutually exclusive)
  - Dropout(0.3) in both heads to prevent overfitting on small datasets
"""

import torch
import torch.nn as nn


class SkinTypeHead(nn.Module):
    """
    4-class skin type classifier: oily, dry, combination, normal.

    Input:  feature vector [B, input_dim] from shared encoder
    Output: raw logits     [B, 4]  — CrossEntropyLoss applied at training,
                                     argmax at inference
    """

    def __init__(self, input_dim: int = 960, hidden_dim: int = 256, num_classes: int = 4):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)  # raw logits — softmax applied at loss / inference


class ConcernMultiLabelHead(nn.Module):
    """
    Multi-label concern classifier.

    Concern labels (fixed order, must match CONCERN_LABELS in dataset.py):
      0: oiliness
      1: dryness
      2: redness
      3: uneven_tone
      4: visible_blemishes

    Input:  feature vector [B, input_dim]
    Output: raw logits     [B, num_concerns] — BCEWithLogitsLoss at training,
                                               sigmoid > 0.5 at inference

    Why multi-label (sigmoid) not multi-class (softmax):
      A single face image can simultaneously show oiliness AND redness.
      softmax would force them to compete as mutually exclusive outcomes,
      which is incorrect for cosmetic skin observations.
    """

    def __init__(
        self,
        input_dim: int = 960,
        hidden_dim: int = 256,
        num_concerns: int = 5,
    ):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_concerns),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)  # raw logits — sigmoid applied at loss / inference


class SkinModel(nn.Module):
    """
    Full multi-task skin analysis model.

    Architecture:
        Input [B, 3, 224, 224]
          ↓
        SkinEncoder (MobileNetV3-Large, shared)
          ↓
        Feature vector [B, 960]
          ├─→ SkinTypeHead    → skin_type_logits  [B, 4]
          └─→ ConcernHead     → concern_logits    [B, num_concerns]

    Single forward pass → both outputs. Losses applied separately then summed:
        total_loss = CrossEntropyLoss(skin_type_logits, skin_type_labels)
                   + BCEWithLogitsLoss(concern_logits, concern_labels)

    Args:
        num_concerns (int): Must match len(CONCERN_LABELS) in dataset.py. Default 5.
    """

    def __init__(self, num_concerns: int = 5):
        super().__init__()
        from src.models.backbone import SkinEncoder  # type: ignore

        self.encoder = SkinEncoder(pretrained=True, unfreeze_last_n_blocks=2)
        self.skin_type_head = SkinTypeHead(input_dim=self.encoder.output_features)
        self.concern_head = ConcernMultiLabelHead(
            input_dim=self.encoder.output_features,
            num_concerns=num_concerns,
        )

    def forward(self, x: torch.Tensor):
        """
        Args:
            x: Input image tensor [B, 3, 224, 224]
        Returns:
            Tuple[Tensor, Tensor]:
                skin_type_logits [B, 4]           — use argmax at inference
                concern_logits   [B, num_concerns] — use sigmoid > 0.5 at inference
        """
        features = self.encoder(x)
        skin_type_logits = self.skin_type_head(features)
        concern_logits = self.concern_head(features)
        return skin_type_logits, concern_logits

    def predict(self, x: torch.Tensor, concern_threshold: float = 0.5):
        """
        Inference-time convenience method.
        Returns human-readable predictions (not raw logits).

        Args:
            x: Batch of images [B, 3, 224, 224]
            concern_threshold: Probability threshold for concern presence
        Returns:
            dict with 'skin_type_idx', 'skin_type_probs', 'concern_flags', 'concern_probs'
        """
        self.eval()
        with torch.no_grad():
            skin_type_logits, concern_logits = self.forward(x)
            skin_type_probs = torch.softmax(skin_type_logits, dim=1)
            concern_probs = torch.sigmoid(concern_logits)
            concern_flags = (concern_probs > concern_threshold).bool()
        return {
            "skin_type_idx": skin_type_logits.argmax(dim=1),
            "skin_type_probs": skin_type_probs,
            "concern_flags": concern_flags,
            "concern_probs": concern_probs,
        }


if __name__ == "__main__":
    # ── Sanity check ─────────────────────────────────────────────────────────
    # Run: python src/models/heads.py
    # Checks full model builds and output shapes are correct before training.
    import sys
    import os
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

    print("Running full model sanity check...")
    model = SkinModel(num_concerns=5)
    dummy = torch.randn(2, 3, 224, 224)
    skin_type_out, concern_out = model(dummy)

    print(f"Skin type logits: {skin_type_out.shape}")   # expect [2, 4]
    print(f"Concern logits:   {concern_out.shape}")      # expect [2, 5]

    assert skin_type_out.shape == (2, 4), f"Shape mismatch: {skin_type_out.shape}"
    assert concern_out.shape == (2, 5), f"Shape mismatch: {concern_out.shape}"
    print("✓ Full model sanity check passed")

    # Also verify predict() method
    preds = model.predict(dummy)
    print(f"Skin type predicted class: {preds['skin_type_idx']}")
    print(f"Concern flags (threshold 0.5): {preds['concern_flags']}")
    print("✓ predict() method works correctly")