import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../../../src/utils/storage';
import { Typography } from '../../../src/design/typography';
import { safeHapticImpact } from '../../../src/utils/haptics';

export default function ScanTab() {
  const router = useRouter();
  const [hasPreviousReport, setHasPreviousReport] = useState(false);

  useEffect(() => {
    storage.getItem('@glowvai_scan_history').then((data: string | null) => {
      if (data) setHasPreviousReport(true);
    });
  }, []);

  const handleLaunchViewfinder = async () => {
    await safeHapticImpact();
    router.push('/(customer)/scan/camera');
  };

  const handleViewLatestReport = async () => {
    await safeHapticImpact();
    router.push('/(customer)/scan/report');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeText}>BIOMETRIC AI ENGINE v2.4</Text>
          </View>
          <Text style={styles.title}>Clinical Face Scan</Text>
          <Text style={styles.subtitle}>
            Compute your 6-dimension skin pulse using Multi-Task CNN deep analysis.
          </Text>
        </View>

        <View style={styles.targetCard}>
          <LinearGradient
            colors={['#FFFDD0', '#FFFFFF']}
            style={styles.targetGradient}
          >
            <View style={styles.scanTargetCircle}>
              <MaterialCommunityIcons name="face-recognition" size={64} color="#7A0C1F" />
            </View>

            <Text style={styles.cardHeader}>8 Skin Metrics Analyzed</Text>

            <View style={styles.metricsGrid}>
              {[
                { name: 'Acne & Blemishes', icon: 'shield-alert-outline' },
                { name: 'Hydration Level', icon: 'water-outline' },
                { name: 'Pore Density', icon: 'grid-outline' },
                { name: 'Melanin Index', icon: 'contrast-outline' },
                { name: 'Sebum Output', icon: 'speedometer-outline' },
                { name: 'Barrier Strength', icon: 'shield-checkmark-outline' },
              ].map((item, idx) => (
                <View key={idx} style={styles.metricPill}>
                  <Ionicons name={item.icon as any} size={14} color="#7A0C1F" />
                  <Text style={styles.metricText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={styles.startScanBtn}
          onPress={handleLaunchViewfinder}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#7A0C1F', '#4A0006']}
            style={styles.btnGradient}
          >
            <MaterialCommunityIcons name="camera-iris" size={22} color="#FFFDD0" />
            <Text style={styles.btnText}>Launch AI Viewfinder</Text>
          </LinearGradient>
        </TouchableOpacity>

        {hasPreviousReport && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleViewLatestReport}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={18} color="#7A0C1F" />
            <Text style={styles.secondaryBtnText}>View Latest Skin Report</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  badgeWrapper: {
    backgroundColor: 'rgba(122, 12, 31, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    ...Typography.labelSm,
    color: '#7A0C1F',
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.headingLg,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
  },
  targetCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(122, 12, 31, 0.15)',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#7A0C1F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 16px rgba(122, 12, 31, 0.08)',
      },
    }),
  },
  targetGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scanTargetCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#7A0C1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardHeader: {
    ...Typography.headingSm,
    color: '#7A0C1F',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 12, 31, 0.1)',
  },
  metricText: {
    ...Typography.bodySm,
    color: '#1E293B',
    fontSize: 12,
  },
  startScanBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  btnText: {
    ...Typography.labelMd,
    color: '#FFFDD0',
    fontSize: 15,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7A0C1F',
    backgroundColor: '#FFFFFF',
  },
  secondaryBtnText: {
    ...Typography.labelMd,
    color: '#7A0C1F',
  },
});
