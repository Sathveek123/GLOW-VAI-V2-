import { useState, useCallback, useRef } from 'react';
import {
  validateCameraFrame,
  CameraValidationResult,
  FrameValidationInput,
} from '../services/cameraValidationEngine';

export function useCameraValidation() {
  const [validationResult, setValidationResult] = useState<CameraValidationResult>(() =>
    validateCameraFrame({
      hasPermission: true,
      cameraAvailable: true,
      faceCount: 0,
      boundsRatio: 0,
      centerOffsetX: 0,
      centerOffsetY: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
      brightness: 0.0,
      sharpness: 0.0,
      isStable: false,
      stableDurationMs: 0,
    })
  );

  const processFrameMetrics = useCallback(
    (input: Partial<FrameValidationInput>) => {
      const currentInput: FrameValidationInput = {
        hasPermission: input.hasPermission ?? true,
        cameraAvailable: input.cameraAvailable ?? true,
        isBlackScreen: input.isBlackScreen ?? false,
        isFrozen: input.isFrozen ?? false,
        faceCount: input.faceCount ?? 0,
        boundsRatio: input.boundsRatio ?? 0,
        centerOffsetX: input.centerOffsetX ?? 0,
        centerOffsetY: input.centerOffsetY ?? 0,
        yaw: input.yaw ?? 0,
        pitch: input.pitch ?? 0,
        roll: input.roll ?? 0,
        brightness: input.brightness ?? 0,
        sharpness: input.sharpness ?? 0,
        glassesDetected: input.glassesDetected ?? false,
        sunglassesDetected: input.sunglassesDetected ?? false,
        capDetected: input.capDetected ?? false,
        maskDetected: input.maskDetected ?? false,
        hairObstruction: input.hairObstruction ?? false,
        smileDetected: input.smileDetected ?? false,
        isStable: input.isStable ?? false,
        stableDurationMs: input.stableDurationMs ?? 0,
      };

      const result = validateCameraFrame(currentInput);
      setValidationResult(result);
    },
    []
  );

  const resetValidation = useCallback(() => {
    setValidationResult(
      validateCameraFrame({
        hasPermission: true,
        cameraAvailable: true,
        faceCount: 0,
        boundsRatio: 0,
        centerOffsetX: 0,
        centerOffsetY: 0,
        yaw: 0,
        pitch: 0,
        roll: 0,
        brightness: 0.0,
        sharpness: 0.0,
        isStable: false,
        stableDurationMs: 0,
      })
    );
  }, []);

  return {
    validationResult,
    processFrameMetrics,
    resetValidation,
  };
}
