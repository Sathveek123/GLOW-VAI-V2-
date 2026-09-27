import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  gold: '#F59E0B',
  goldBg: '#FEF3C7',
  creditGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
  debitRed: '#DC2626',
  softRed: '#FEE2E2',
  holdingAmber: '#D97706',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
};

export const ReferralTransactionsScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState<'all' | 'credited' | 'holding'>('all');

  const transactions = [
    {
      id: 'tx1',
      title: 'Referral Bonus · Rajesh K.',
      sub: 'Order #GV28491 completed',
      type: 'credit',
      status: 'CREDITED',
      coins: '+100',
      date: 'Today, 02:30 PM',
    },
    {
      id: 'tx2',
      title: 'Redeemed on Order #GV28400',
      sub: 'Checkout discount voucher applied',
      type: 'debit',
      status: 'REDEEMED',
      coins: '-150',
      date: 'Yesterday, 11:15 AM',
    },
    {
      id: 'tx3',
      title: 'Referral Bonus · Kavya T.',
      sub: '7-day fraud prevention holding period',
      type: 'holding',
      status: 'HOLDING (5 DAYS LEFT)',
      coins: '+100',
      date: '12 Sep 2026',
    },
    {
      id: 'tx4',
      title: 'Student ID Audit Bonus',
      sub: 'SRM University email verified',
      type: 'credit',
      status: 'CREDITED',
      coins: '+200',
      date: '10 Sep 2026',
    },
  ];

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

        <Text style={styles.headerTitle}>Glow Coins Ledger</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.coinBadge}>
              <Coins size={24} color={ColorTokens.gold} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.balanceVal}>₹250 Coins Balance</Text>
              <Text style={styles.balanceSub}>1 Coin = ₹1 Store Discount</Text>
            </View>
          </View>

          <View style={styles.holdingNotice}>
            <Clock size={14} color={ColorTokens.holdingAmber} />
            <Text style={styles.holdingText}>
              +100 coins currently in 7-day holding period to verify referral delivery.
            </Text>
          </View>
        </View>

        {/* SEGMENTED FILTER CHIPS */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'credited', label: 'Credited' },
            { id: 'holding', label: 'Pending Holding' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => {
                  safeHapticSelection();
                  setActiveFilter(tab.id as any);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TRANSACTIONS LIST */}
        <View style={styles.listCard}>
          <Text style={styles.listTitle}>Coin Activity History</Text>

          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View
                style={[
                  styles.txIconWrap,
                  tx.type === 'credit'
                    ? { backgroundColor: ColorTokens.softGreen }
                    : tx.type === 'debit'
                    ? { backgroundColor: ColorTokens.softRed }
                    : { backgroundColor: '#FEF3C7' },
                ]}
              >
                {tx.type === 'credit' ? (
                  <ArrowDownLeft size={18} color={ColorTokens.creditGreen} />
                ) : tx.type === 'debit' ? (
                  <ArrowUpRight size={18} color={ColorTokens.debitRed} />
                ) : (
                  <Clock size={18} color={ColorTokens.holdingAmber} />
                )}
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txSub}>{tx.sub}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={[
                    styles.txCoinsVal,
                    tx.type === 'credit'
                      ? { color: ColorTokens.creditGreen }
                      : tx.type === 'debit'
                      ? { color: ColorTokens.debitRed }
                      : { color: ColorTokens.holdingAmber },
                  ]}
                >
                  {tx.coins}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    tx.type === 'credit'
                      ? { backgroundColor: ColorTokens.softGreen }
                      : tx.type === 'debit'
                      ? { backgroundColor: ColorTokens.softRed }
                      : { backgroundColor: '#FEF3C7' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      tx.type === 'credit'
                        ? { color: ColorTokens.creditGreen }
                        : tx.type === 'debit'
                        ? { color: ColorTokens.debitRed }
                        : { color: ColorTokens.holdingAmber },
                    ]}
                  >
                    {tx.status}
                  </Text>
                </View>
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
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: ColorTokens.goldBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#92400E',
  },
  balanceSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  holdingNotice: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  holdingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.holdingAmber,
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  filterChipActive: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  filterChipTextActive: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  listTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F5EFEF',
  },
  txIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  txSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.secondaryText,
  },
  txDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#999999',
    marginTop: 2,
  },
  txCoinsVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusPillText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
  },
});
