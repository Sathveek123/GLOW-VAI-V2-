import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { AlertTriangle, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  warmIvory: '#FFFDF7',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface AuthErrorScreenProps {
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export const AuthErrorScreen: React.FC<AuthErrorScreenProps> = ({
  errorTitle = 'Authentication Session Expired',
  errorMessage = 'Your login token was invalidated or expired. Please sign in again to protect your diagnostic data.',
  onRetry,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const handleRetryLogin = () => {
    if (onRetry) onRetry();
    else router.replace('/(auth)/login' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => router.replace('/(auth)/welcome' as any)}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={ColorTokens.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Authentication Notice</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* CENTER ERROR BODY */}
      <View style={styles.centerBody}>
        <View style={styles.iconCircle}>
          <ShieldAlert size={48} color={ColorTokens.deepBerry} />
        </View>

        <Text style={styles.errorTitle}>{errorTitle}</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        <TouchableOpacity style={styles.retryBtn} onPress={handleRetryLogin} activeOpacity={0.88}>
          <RefreshCw size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.retryBtnText}>Sign In Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestLink}
          onPress={() => router.replace('/(customer)/(tabs)' as any)}
        >
          <Text style={styles.guestLinkText}>Continue as Guest →</Text>
        </TouchableOpacity>
      </View>

      {/* STICKY FOOTER */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text style={styles.footerNote}>Protected by GlowVAI 256-Bit Firebase Security</Text>
      </View>
    </SafeAreaView>
  );
};

export default AuthErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: ColorTokens.border,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3EFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  centerBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorTokens.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  retryBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  guestLink: {
    paddingVertical: 8,
  },
  guestLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.mutedText,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerNote: {
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
});
