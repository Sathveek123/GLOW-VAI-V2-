import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, View, ScrollView, StyleSheet, Dimensions } from 'react-native';

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

let NativePagerView: any = null;
if (Platform.OS !== 'web') {
  try {
    NativePagerView = require('react-native-pager-view').default;
  } catch {
    NativePagerView = null;
  }
}

export const SafePagerView = forwardRef<SafePagerViewRef, SafePagerViewProps>((props, ref) => {
  const { style, initialPage = 0, onPageSelected, onTouchStart, children } = props;
  const nativeRef = useRef<any>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  useImperativeHandle(ref, () => ({
    setPage: (page: number) => {
      if (Platform.OS !== 'web' && nativeRef.current) {
        nativeRef.current.setPage(page);
      } else if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: page * width, animated: true });
      }
    },
  }));

  if (Platform.OS !== 'web' && NativePagerView) {
    return (
      <NativePagerView
        ref={nativeRef}
        style={style}
        initialPage={initialPage}
        onPageSelected={onPageSelected}
        onTouchStart={onTouchStart}
      >
        {children}
      </NativePagerView>
    );
  }

  // Web Fallback: ScrollView carousel
  const childrenArray = React.Children.toArray(children);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={style}
      onScroll={(e) => {
        const offset = e.nativeEvent.contentOffset.x;
        const page = Math.round(offset / (e.nativeEvent.layoutMeasurement.width || width));
        if (onPageSelected) {
          onPageSelected({ nativeEvent: { position: page } });
        }
      }}
      scrollEventThrottle={16}
      onTouchStart={onTouchStart}
    >
      {childrenArray.map((child, idx) => (
        <View key={idx} style={{ width: width - 48, height: '100%' }}>
          {child}
        </View>
      ))}
    </ScrollView>
  );
});

SafePagerView.displayName = 'SafePagerView';
