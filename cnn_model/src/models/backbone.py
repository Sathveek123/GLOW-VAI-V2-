"""
GlowVAI Skin Analysis — Shared MobileNetV3-Large Encoder (Phase 5)
===================================================================
Architecture decision: MobileNetV3-Large, NOT ResNet-50.
Rationale:
  - ~14 MB vs ResNet-50's ~98 MB (6.7× smaller)
  - Runs on mobile NPUs (ARM Mali, Apple Neural Engine, Hexagon DSP)
  - Sufficient feature depth for cosmetic skin concern classification
  - Standard ImageNet pre-training gives strong texture priors

Unfreezing strategy:
  - Fully frozen backbone wastes transfer-learning benefit for a
    domain-specific task (skin texture ≠ ImageNet object categories)
  - Selectively unfreeze last N blocks for fine-tuning
  - Default: unfreeze last 2 blocks (~1.2M trainable params)
"""

import torch
import torch.nn as nn
from torchvision import models


class SkinEncoder(nn.Module):
    """
    Shared MobileNetV3-Large encoder — shared feature extractor for
    all GlowVAI skin analysis task heads.

    Args:
        pretrained (bool): Load ImageNet weights. Always True in production.
        unfreeze_last_n_blocks (int): Number of final feature blocks to
            unfreeze for fine-tuning. 0 = fully frozen, len(features) = all.
            Default 2 is a good balance for ~5k–50k image datasets.
    """

    def __init__(self, pretrained: bool = True, unfreeze_last_n_blocks: int = 2):
        super().__init__()
        weights = models.MobileNet_V3_Large_Weights.DEFAULT if pretrained else None
        backbone = models.mobilenet_v3_large(weights=weights)

        # Strip the classifier head — keep only the feature extractor
        self.features = backbone.features
        self.avgpool = backbone.avgpool
        # MobileNetV3-Large's feature dim before any classifier head
        self.output_features = 960

        # Step 1: Freeze everything
        for param in self.features.parameters():
            param.requires_grad = False

        # Step 2: Selectively unfreeze the last N blocks for fine-tuning
        total_blocks = len(self.features)
        for i in range(total_blocks - unfreeze_last_n_blocks, total_blocks):
            for param in self.features[i].parameters():
                param.requires_grad = True

        unfrozen = self.trainable_param_count()
        total = sum(p.numel() for p in self.parameters())
        print(
            f"[SkinEncoder] MobileNetV3-Large loaded. "
            f"Trainable: {unfrozen:,} / {total:,} params "
            f"({unfrozen / total * 100:.1f}%) — "
            f"last {unfreeze_last_n_blocks} of {total_blocks} blocks unfrozen"
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Args:
            x: Input tensor [B, 3, 224, 224], ImageNet-normalised
        Returns:
            Feature vector [B, 960]
        """
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        return x

    def trainable_param_count(self) -> int:
        """Returns number of parameters with requires_grad=True."""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)


if __name__ == "__main__":
    # ── Sanity check ─────────────────────────────────────────────────────────
    # Run: python src/models/backbone.py
    # Verifies model builds and produces correct output shape BEFORE
    # committing it to a training run. Fail early, not mid-epoch.
    print("Running backbone sanity check...")
    model = SkinEncoder(pretrained=True, unfreeze_last_n_blocks=2)
    dummy = torch.randn(2, 3, 224, 224)
    out = model(dummy)
    print(f"Output shape: {out.shape}")   # expect [2, 960]
    assert out.shape == (2, 960), f"Shape mismatch: got {out.shape}, expected (2, 960)"
    print("✓ Backbone sanity check passed")