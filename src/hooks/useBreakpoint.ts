import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export function getBreakpoint(width: number): Breakpoint {
  if (width >= 1440) return 'wide';
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    getBreakpoint(Dimensions.get('window').width)
  );

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setBreakpoint(getBreakpoint(window.width));
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return breakpoint;
}

export default useBreakpoint;
