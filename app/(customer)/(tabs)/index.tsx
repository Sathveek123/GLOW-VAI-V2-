import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import HomeScreen from '../../../src/features/shop/HomeScreen';
import { DesktopHomeLayout } from '../../../src/features/shop/web/DesktopHomeLayout';
import { useBreakpoint } from '../../../src/hooks/useBreakpoint';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class HomeErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('[HomeScreen Crash Caught]:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚡</Text>
          <Text style={styles.errorTitle}>GlowVAI Quick-Commerce</Text>
          <Text style={styles.errorSub}>{this.state.error?.message || 'Recovering fresh dark store session...'}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.retryBtnText}>Reload Home Screen</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function CustomerHomeRoute() {
  const breakpoint = useBreakpoint();
  const isWeb = Platform.OS === 'web';

  return (
    <HomeErrorBoundary>
      {isWeb && breakpoint !== 'mobile' ? (
        <DesktopHomeLayout breakpoint={breakpoint} />
      ) : (
        <HomeScreen />
      )}
    </HomeErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  errorSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
  retryBtn: {
    backgroundColor: '#7A0C1F',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
