import React from 'react';
import { GlowVaiWebviewHomeScreen } from './GlowVaiWebviewHomeScreen';

interface DesktopHomeLayoutProps {
  breakpoint: 'tablet' | 'desktop' | 'wide';
}

export function DesktopHomeLayout({ breakpoint }: DesktopHomeLayoutProps) {
  return <GlowVaiWebviewHomeScreen />;
}

