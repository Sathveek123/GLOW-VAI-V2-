import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle2,
  Bike,
  Package,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  darkBg: '#0F172A',
  cardBg: '#FFFFFF',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  successGreen: '#2D9D5F',
  warningAmber: '#D97706',
};

export const AdminDarkstoreOperationsScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [activeQueue] = useState([
    {
      id: 'GV28491',
      itemsCount: 3,
      slaSeconds: 42,
      bay: 'Bay #04',
      status: 'PICKING',
      customer: 'Ananya S.',
    },
    {
      id: 'GV28492',
      itemsCount: 1,
      slaSeconds: 78,
      bay: 'Bay #02',
      status: 'PACKED',
      customer: 'Rahul M.',
    },
    {
      id: 'GV28493',
      itemsCount: 4,
      slaSeconds: 15,
      bay: 'Bay #01',
      status: 'PICKING',
      customer: 'Sneha P.',
    },
  ]);

  const handleDispatchRider = (id: string) => {
    safeHapticImpact();
    Alert.alert('Rider Dispatched', `Rider Rahul assigned to order #${id}. WhatsApp tracking link generated.`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(customer)/(tabs)' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payikapuram Dark Store Operations</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* OPERATIONAL SLA METRICS CARD */}
        <View style={styles.slaCard}>
          <View style={styles.slaMetric}>
            <Clock size={20} color={ColorTokens.warningAmber} />
            <Text style={styles.metricVal}>64s</Text>
            <Text style={styles.metricLabel}>Avg Pick SLA</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.slaMetric}>
            <Zap size={20} color={ColorTokens.successGreen} />
            <Text style={styles.metricVal}>98.4%</Text>
            <Text style={styles.metricLabel}>10-Min Delivery SLA</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.slaMetric}>
            <Bike size={20} color="#1677E8" />
            <Text style={styles.metricVal}>12</Text>
            <Text style={styles.metricLabel}>Active Riders</Text>
          </View>
        </View>

        {/* LIVE ORDERS QUEUE TABLE */}
        <View style={styles.queueCard}>
          <View style={styles.queueHeaderRow}>
            <Text style={styles.queueTitle}>Live Pick Queue ({activeQueue.length})</Text>
            <TouchableOpacity style={styles.refreshBtn} activeOpacity={0.8}>
              <RefreshCw size={14} color={ColorTokens.deepBerry} />
            </TouchableOpacity>
          </View>

          {activeQueue.map((item) => (
            <View key={item.id} style={styles.orderRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.orderIdText}>#{item.id}</Text>
                  <View style={styles.bayBadge}>
                    <Text style={styles.bayText}>{item.bay}</Text>
                  </View>
                </View>
                <Text style={styles.orderSub}>{item.customer} · {item.itemsCount} items</Text>
              </View>

              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={styles.slaTimerBox}>
                  <Clock size={12} color={ColorTokens.warningAmber} />
                  <Text style={styles.slaTimerText}>{item.slaSeconds}s left</Text>
                </View>

                <TouchableOpacity
                  style={styles.dispatchBtn}
                  onPress={() => handleDispatchRider(item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.dispatchBtnText}>DISPATCH RIDER</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 90 + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  slaCard: {
    backgroundColor: ColorTokens.darkBg,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slaMetric: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 4,
  },
  metricLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#94A3B8',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#334155',
  },
  queueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  queueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  refreshBtn: {
    padding: 4,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F5EFEF',
  },
  orderIdText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  bayBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bayText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: '#475569',
  },
  orderSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  slaTimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slaTimerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.warningAmber,
  },
  dispatchBtn: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dispatchBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: '#FFFFFF',
  },
});
