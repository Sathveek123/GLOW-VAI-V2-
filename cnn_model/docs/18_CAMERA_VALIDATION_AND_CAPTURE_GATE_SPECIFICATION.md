# GlowVAI Camera Validation Engine & Capture-Gate Specification

> **Document:** 18 · **Status:** Partially Implemented — see note below

> [!NOTE]
> **Expression Flow (Priority 15) is specified but not yet implemented.**
> The currently shipped `useFaceGuidance.ts` capture gate covers priorities **1–14 and 16–17** only.
> Priority 15 — the Two-Step Expression Flow (smile detection → neutral hold) using ML Kit's `smilingProbability` classifier — is fully specified in Section 3 of this document but has not been wired into the live viewfinder logic.
>
> This is tracked in **[Doc 07 Section 2](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/07_EMPIRICAL_AUDIT_POSITIVES_AND_DRAWBACKS.md)** under "What Requires Completion Before Production":
> | Expression flow (smile→neutral) | ML Kit smilingProbability not wired | Extend useFaceGuidance.ts with expression state machine per Doc 18 Section 3 |

---

## 1. Executive Summary & Governing Rule

The **GlowVAI Real-Time Camera Validation Engine** acts as an intelligent pre-analysis assistant during the face scan viewfinder phase.

### Core Rule:
The skin-analysis CNN **MUST NOT RUN** until the camera image satisfies all mandatory capture conditions:
1. Exactly one face detected.
2. Face centered inside reticle ($\pm 15\%$ tolerance).
3. Face width between $25\%$ and $70\%$ of frame width.
4. Head pose within frontal threshold ($\text{yaw} \le 18^\circ$, $\text{pitch} \le 15^\circ$, $\text{roll} \le 12^\circ$).
5. No sunglasses, masks, or critical facial area obstructions.
6. Lighting score $\ge 0.32$ and $\le 0.90$.
7. Image sharpness $\ge 0.40$.
8. Two-Step Expression Flow completed (Step 1: Gentle Smile Check $\rightarrow$ Step 2: Neutral Expression Confirmation).
9. Position stable for $\ge 500\text{ms}$.

---

## 2. Priority Validation Resolver

When multiple conditions fail, the validation engine resolves errors in strict priority order to show only the single most urgent, actionable message:

```
[Priority Order]
1. Permission Denied
2. Camera Unavailable / Hardware Failure
3. Black Screen Detection
4. Camera Frozen
5. No Face Detected
6. Multiple Faces Detected
7. Sunglasses Detected
8. Mask Detected
9. Hair Obstruction
10. Face Distance (Too Far / Too Close)
11. Face Centering (Left / Right / Up / Down)
12. Head Pose (Yaw / Pitch / Roll)
13. Lighting (Dark / Overexposed)
14. Blur & Sharpness
15. Expression Flow (Smile Check -> Neutral Check)
16. Stability Hold
17. Ready to Capture Gate (GREEN)
```

---

## 3. Two-Step Expression Capture Flow

```
+-------------------------------------------------------------+
| Step 1: Gentle Smile Check                                  |
| Message: "Please give a gentle natural smile..."            |
| Goal: Confirms face presence, eye open state & engagement  |
+-------------------------------------------------------------+
                              |
                              | (Smile detected for 300-800ms)
                              v
+-------------------------------------------------------------+
| Step 2: Neutral Expression Confirmation                      |
| Message: "Great! Now relax your face and hold still..."     |
| Goal: Ensures neutral expression for final skin CNN snapshot |
+-------------------------------------------------------------+
                              |
                              | (Neutral expression + stable 500ms+)
                              v
+-------------------------------------------------------------+
| READY TO CAPTURE GATE (shutter button enabled)              |
+-------------------------------------------------------------+
```

---

## 4. Structured Result Schema Contract

```ts
export type CameraValidationResult = {
  state: CameraValidationState;
  canCapture: boolean;
  priority: number;
  userMessage: string;
  secondaryMessage?: string;
  overlayColor: 'gray' | 'yellow' | 'orange' | 'green';

  face: {
    detected: boolean;
    count: number;
    confidence: number;
    insideFrame: boolean;
    sizeScore: number;
    distanceScore: number;
    centerScore: number;
  };

  pose: {
    yaw: number;
    pitch: number;
    roll: number;
    yawValid: boolean;
    pitchValid: boolean;
    rollValid: boolean;
    neckPoseValid: boolean;
  };

  eyes: {
    visible: boolean;
    open: boolean;
    lookingAtCamera: boolean;
    sunglassesDetected: boolean;
    glassesDetected: boolean;
  };

  wearables: {
    capDetected: boolean;
    hatDetected: boolean;
    helmetDetected: boolean;
    maskDetected: boolean;
    otherObstructionDetected: boolean;
    hairObstruction: boolean;
  };

  expression: {
    smileRequired: boolean;
    smileDetected: boolean;
    neutralRequired: boolean;
    neutralDetected: boolean;
  };

  image: {
    frameAvailable: boolean;
    blackScreen: boolean;
    frozen: boolean;
    brightnessScore: number;
    uniformityScore: number;
    sharpnessScore: number;
    resolutionScore: number;
    qualityScore: number;
  };

  stability: {
    stable: boolean;
    stableDurationMs: number;
  };
};
```
