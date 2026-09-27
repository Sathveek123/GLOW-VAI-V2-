import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react-native';
import { router } from 'expo-router';
import { logTouch } from '../utils/touchDoctor';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  referenceId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      referenceId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0');
    return {
      hasError: true,
      error,
      referenceId: `ERR-${randomHex}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[GlowVAI ErrorBoundary] Render Exception Caught:', error, errorInfo);
  }

  handleReload = () => {
    logTouch('ErrorBoundary Try Again Pressed', { screen: 'ErrorBoundary' });
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    logTouch('ErrorBoundary Go Home Pressed', { screen: 'ErrorBoundary' });
    this.setState({ hasError: false, error: null, errorInfo: null });
    try {
      router.replace('/(customer)/(tabs)');
    } catch {
      // Fallback if router fails
    }
  };

  handleOpenDoctor = () => {
    logTouch('ErrorBoundary Open App Doctor', { screen: 'ErrorBoundary' });
    try {
      router.push('/(debug)/app-doctor' as any);
    } catch {
      // Ignore navigation failure
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#8F0D2F" />

          <View style={styles.header}>
            <ShieldAlert size={22} color="#FFFFFF" />
            <Text style={styles.headerTitle}>GlowVAI Recovery System</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.iconCircle}>
                <AlertCircle size={44} color="#8F0D2F" />
              </View>

              <Text style={styles.title}>Something went wrong</Text>
              <Text style={styles.subtitle}>
                GlowVAI encountered an unexpected issue while loading this screen.
              </Text>

              <View style={styles.refBadge}>
                <Text style={styles.refLabel}>Support Reference:</Text>
                <Text style={styles.refValue}>{this.state.referenceId}</Text>
              </View>

              {__DEV__ && this.state.error && (
                <View style={styles.devErrorBox}>
                  <Text style={styles.devErrorTitle}>DEVELOPMENT DETAILS</Text>
                  <Text style={styles.devErrorMsg}>{this.state.error.toString()}</Text>
                  {this.state.errorInfo?.componentStack && (
                    <Text style={styles.devStack}>{this.state.errorInfo.componentStack.trim()}</Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.primaryBtn} onPress={this.handleReload} activeOpacity={0.85}>
                <RefreshCw size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={this.handleGoHome} activeOpacity={0.85}>
                <Home size={18} color="#8F0D2F" style={{ marginRight: 8 }} />
                <Text style={styles.secondaryBtnText}>Go to Home</Text>
              </TouchableOpacity>

              {__DEV__ && (
                <TouchableOpacity style={styles.debugBtn} onPress={this.handleOpenDoctor} activeOpacity={0.85}>
                  <Text style={styles.debugBtnText}>Open App Doctor 🩺</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF7' },
  header: {
    backgroundColor: '#8F0D2F',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  content: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E1E5',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FAF4EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#321A2B', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#756C73', textAlign: 'center', lineHeight: 20, marginBottom: 18 },
  refBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2ECFA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  refLabel: { fontSize: 12, fontWeight: '600', color: '#5C2A91' },
  refValue: { fontSize: 13, fontWeight: '800', color: '#8F0D2F', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  devErrorBox: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },
  devErrorTitle: { fontSize: 10, fontWeight: '800', color: '#F27F78', letterSpacing: 1, marginBottom: 6 },
  devErrorMsg: { fontSize: 11, color: '#FFD700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 6 },
  devStack: { fontSize: 9, color: '#CCCCCC', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', maxHeight: 120 },
  actionContainer: { width: '100%', gap: 12 },
  primaryBtn: {
    backgroundColor: '#8F0D2F',
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E1E5',
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: '#8F0D2F' },
  debugBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  debugBtnText: { fontSize: 13, fontWeight: '700', color: '#5C2A91' },
});

export default ErrorBoundary;
