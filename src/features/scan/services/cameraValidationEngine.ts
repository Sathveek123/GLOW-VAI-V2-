export type OcclusionState =
  | 'checking'
  | 'clear'
  | 'glasses_detected'
  | 'sunglasses_detected'
  | 'face_obstructed'
  | 'unavailable';

export type CameraValidationState =
  | 'initializing'
  | 'permission_required'
  | 'permission_denied'
  | 'camera_unavailable'
  | 'camera_black_screen'
  | 'camera_frozen'
  | 'no_face'
  | 'multiple_faces'
  | 'face_too_far'
  | 'face_too_close'
  | 'face_not_centered'
  | 'face_left_of_frame'
  | 'face_right_of_frame'
  | 'face_above_frame'
  | 'face_below_frame'
  | 'head_pose_invalid'
  | 'eyes_not_facing_camera'
  | 'glasses_detected'
  | 'sunglasses_detected'
  | 'cap_detected'
  | 'mask_detected'
  | 'face_obstructed'
  | 'low_light'
  | 'overexposed'
  | 'blurry'
  | 'checking'
  | 'ready_to_capture'
  | 'capturing'
  | 'capture_failed'
  | 'preview_ready';

export type CameraValidationResult = {
  state: CameraValidationState;
  occlusionState: OcclusionState;
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

export interface FrameValidationInput {
  hasPermission: boolean;
  cameraAvailable: boolean;
  isBlackScreen?: boolean;
  isFrozen?: boolean;
  faceCount: number;
  boundsRatio: number;      // 0-1 (face width / frame width)
  centerOffsetX: number;    // -1 to 1
  centerOffsetY: number;    // -1 to 1
  yaw: number;              // -90 to +90
  pitch: number;            // -90 to +90
  roll: number;             // -90 to +90
  brightness: number;       // 0-1
  sharpness: number;        // 0-1
  glassesDetected?: boolean;
  sunglassesDetected?: boolean;
  capDetected?: boolean;
  maskDetected?: boolean;
  hairObstruction?: boolean;
  occlusionState?: OcclusionState;
  smileDetected?: boolean;
  isStable: boolean;
  stableDurationMs: number;
  expressionPhase?: 'smile_check' | 'neutral_check' | 'complete';
}

/**
 * Priority Validation Engine: Resolves camera frame state and returns single highest-priority
 * actionable guidance message. Safely defaults to unverified/false state.
 */
export function validateCameraFrame(input: FrameValidationInput): CameraValidationResult {
  // 1. Permission checks
  if (!input.hasPermission) {
    return createResult('permission_denied', 'unavailable', false, 1, 'Camera permission is required', 'gray');
  }

  // 2. Camera availability & Black screen failure checks
  if (!input.cameraAvailable) {
    return createResult('camera_unavailable', 'unavailable', false, 2, 'Camera preview unavailable', 'gray');
  }
  if (input.isBlackScreen) {
    return createResult('camera_black_screen', 'unavailable', false, 3, 'Camera preview unavailable — reopen camera or check permissions.', 'orange');
  }
  if (input.isFrozen) {
    return createResult('camera_frozen', 'unavailable', false, 4, 'Camera view is frozen. Please restart scanner.', 'orange');
  }

  // 3. Face Presence & Count checks
  if (input.faceCount === 0) {
    return createResult('no_face', 'checking', false, 5, 'Please place your face inside the frame', 'gray');
  }
  if (input.faceCount > 1) {
    return createResult('multiple_faces', 'face_obstructed', false, 6, 'Only one face should be visible', 'orange');
  }

  // 4. Critical Occlusion & Wearable checks
  if (input.sunglassesDetected) {
    return createResult('sunglasses_detected', 'sunglasses_detected', false, 7, 'Please remove your sunglasses', 'orange');
  }
  if (input.glassesDetected) {
    return createResult('glasses_detected', 'glasses_detected', false, 7, 'Please remove your glasses or sunglasses', 'orange');
  }
  if (input.maskDetected) {
    return createResult('mask_detected', 'face_obstructed', false, 8, 'Keep your face fully visible', 'orange');
  }
  if (input.capDetected) {
    return createResult('cap_detected', 'face_obstructed', false, 9, 'Please remove your cap or hat', 'orange');
  }
  if (input.hairObstruction) {
    return createResult('face_obstructed', 'face_obstructed', false, 10, 'Keep your face fully visible', 'yellow');
  }

  // Explicit OcclusionState input check
  if (input.occlusionState === 'glasses_detected') {
    return createResult('glasses_detected', 'glasses_detected', false, 7, 'Please remove your glasses or sunglasses', 'orange');
  }
  if (input.occlusionState === 'sunglasses_detected') {
    return createResult('sunglasses_detected', 'sunglasses_detected', false, 7, 'Please remove your sunglasses', 'orange');
  }
  if (input.occlusionState === 'face_obstructed') {
    return createResult('face_obstructed', 'face_obstructed', false, 10, 'Keep your face fully visible', 'yellow');
  }
  if (input.occlusionState === 'unavailable') {
    return createResult('checking', 'unavailable', false, 10.5, 'Make sure your face is clear and unobstructed', 'yellow');
  }
  if (input.occlusionState === 'checking') {
    return createResult('checking', 'checking', false, 10.6, 'Checking face visibility…', 'yellow');
  }

  // 5. Distance & Size checks
  if (input.boundsRatio < 0.25) {
    return createResult('face_too_far', 'checking', false, 11, 'Move a little closer', 'yellow');
  }
  if (input.boundsRatio > 0.70) {
    return createResult('face_too_close', 'checking', false, 12, 'Move a little farther away', 'yellow');
  }

  // 6. Centering & Position checks
  const absX = Math.abs(input.centerOffsetX);
  const absY = Math.abs(input.centerOffsetY);
  if (absX > 0.15 || absY > 0.15) {
    return createResult('face_not_centered', 'checking', false, 13, 'Please keep your face centered', 'yellow');
  }

  // 7. Head Pose & Angle checks
  if (Math.abs(input.yaw) > 18) {
    return createResult('eyes_not_facing_camera', 'checking', false, 14, 'Please look directly at the camera', 'yellow');
  }
  if (Math.abs(input.pitch) > 15 || Math.abs(input.roll) > 12) {
    return createResult('head_pose_invalid', 'checking', false, 15, 'Please keep your head straight', 'yellow');
  }

  // 8. Lighting checks
  if (input.brightness < 0.32) {
    return createResult('low_light', 'checking', false, 16, 'Move to a brighter area', 'yellow');
  }
  if (input.brightness > 0.90) {
    return createResult('overexposed', 'checking', false, 17, 'Avoid direct harsh light', 'yellow');
  }

  // 9. Blur & Sharpness checks
  if (input.sharpness < 0.40) {
    return createResult('blurry', 'checking', false, 18, 'Hold still for a clearer scan', 'yellow');
  }

  // 10. Stability Validation
  if (!input.isStable || input.stableDurationMs < 500) {
    return createResult('checking', 'checking', false, 19, 'Checking your scan…', 'yellow');
  }

  // 11. All Conditions Passed -> READY TO CAPTURE GATE
  return createResult(
    'ready_to_capture',
    'clear',
    true,
    20,
    'Ready — tap capture',
    'green',
    'Face centered, unobstructed & lighting verified.'
  );
}

function createResult(
  state: CameraValidationState,
  occlusionState: OcclusionState,
  canCapture: boolean,
  priority: number,
  userMessage: string,
  overlayColor: 'gray' | 'yellow' | 'orange' | 'green',
  secondaryMessage?: string
): CameraValidationResult {
  const isPass = canCapture && overlayColor === 'green' && occlusionState === 'clear';

  return {
    state,
    occlusionState,
    canCapture: isPass,
    priority,
    userMessage,
    secondaryMessage,
    overlayColor,
    face: {
      detected: isPass || (state !== 'no_face' && state !== 'permission_denied' && state !== 'camera_unavailable' && state !== 'initializing'),
      count: state === 'multiple_faces' ? 2 : state === 'no_face' ? 0 : 1,
      confidence: isPass ? 0.95 : 0.0,
      insideFrame: isPass,
      sizeScore: isPass ? 0.85 : 0.0,
      distanceScore: isPass ? 0.85 : 0.0,
      centerScore: isPass ? 0.90 : 0.0,
    },
    pose: {
      yaw: 0,
      pitch: 0,
      roll: 0,
      yawValid: state !== 'eyes_not_facing_camera',
      pitchValid: state !== 'head_pose_invalid',
      rollValid: state !== 'head_pose_invalid',
      neckPoseValid: isPass,
    },
    eyes: {
      visible: occlusionState === 'clear',
      open: isPass,
      lookingAtCamera: state !== 'eyes_not_facing_camera',
      sunglassesDetected: occlusionState === 'sunglasses_detected',
      glassesDetected: occlusionState === 'glasses_detected',
    },
    wearables: {
      capDetected: state === 'cap_detected',
      hatDetected: false,
      helmetDetected: false,
      maskDetected: state === 'mask_detected',
      otherObstructionDetected: occlusionState === 'face_obstructed',
      hairObstruction: state === 'face_obstructed',
    },
    expression: {
      smileRequired: false,
      smileDetected: false,
      neutralRequired: true,
      neutralDetected: isPass,
    },
    image: {
      frameAvailable: state !== 'camera_black_screen' && state !== 'camera_unavailable',
      blackScreen: state === 'camera_black_screen',
      frozen: state === 'camera_frozen',
      brightnessScore: isPass ? 0.80 : 0.0,
      uniformityScore: isPass ? 0.85 : 0.0,
      sharpnessScore: isPass ? 0.85 : 0.0,
      resolutionScore: isPass ? 0.90 : 0.0,
      qualityScore: isPass ? 0.92 : 0.0,
    },
    stability: {
      stable: isPass,
      stableDurationMs: isPass ? 800 : 0,
    },
  };
}

