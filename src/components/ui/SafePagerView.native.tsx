import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PagerView from 'react-native-pager-view';

export interface SafePagerViewRef {
  setPage: (page: number) => void;
}

interface SafePagerViewProps {
  style?: any;
  initialPage?: number;
  onPageSelected?: (e: { nativeEvent: { position: number } }) => void;
  onTouchStart?: () => void;
  children: React.ReactNode;
}

export const SafePagerView = forwardRef<SafePagerViewRef, SafePagerViewProps>((props, ref) => {
  const { style, initialPage = 0, onPageSelected, onTouchStart, children } = props;
  const nativeRef = useRef<PagerView>(null);

  useImperativeHandle(ref, () => ({
    setPage: (page: number) => {
      nativeRef.current?.setPage(page);
    },
  }));

  return (
    <PagerView
      ref={nativeRef}
      style={style}
      initialPage={initialPage}
      onPageSelected={onPageSelected}
      onTouchStart={onTouchStart}
    >
      {children}
    </PagerView>
  );
});

SafePagerView.displayName = 'SafePagerView';
