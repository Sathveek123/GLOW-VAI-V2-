import React from 'react';
import { useRouter } from 'expo-router';
import { ScanAnalysisScreen } from '../../../src/features/scan/ScanAnalysisScreen';

export default function AnalyzingRoute() {
  const router = useRouter();

  return (
    <ScanAnalysisScreen
      onComplete={(result) =>
        router.push({
          pathname: '/(customer)/scan/report' as any,
          params: result ? { result: JSON.stringify(result) } : undefined,
        })
      }
      onFail={() => router.push('/(customer)/scan/failed' as any)}
    />
  );
}
