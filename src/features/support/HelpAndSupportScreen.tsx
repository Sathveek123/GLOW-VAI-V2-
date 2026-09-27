import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  whatsappGreen: '#25D366',
  softGreen: '#E6F4EA',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
  plum: '#5C2A91',
};

export interface HelpAndSupportScreenProps {
  onBack?: () => void;
  onSelectOrder?: (orderId?: string) => void;
}

export const HelpAndSupportScreen: React.FC<HelpAndSupportScreenProps> = ({ onBack, onSelectOrder }) => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast is 10-Min Express Delivery in Vijayawada?',
      a: 'Orders placed within our Payikapuram and Benz Circle dark store coverage areas are picked, packed, and delivered by our dedicated riders within 15–30 minutes max.',
    },
    {
      q: 'What is GlowVAI 100% Beauty Protection Coverage?',
      a: 'Every product purchase can opt-in for ₹29 Beauty Protection. If a product causes breakouts or redness within 14 days, upload photo proof for 100% wallet refund.',
    },
    {
      q: 'How do I redeem GlowVAI Referral Coins?',
      a: 'Referral coins earned from student invites can be redeemed directly on the checkout screen for up to 20% instant cart discount.',
    },
    {
      q: 'Can I cancel an active order before delivery?',
      a: 'Yes! Orders can be cancelled free of charge from the Order Details screen before our dark store finishes packing.',
    },
  ];

  const toggleFaq = (idx: number) => {
    safeHapticSelection();
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const handleOpenWhatsApp = () => {
    safeHapticImpact();
    Linking.openURL('https://wa.me/919876543210?text=Hi%20GlowVAI%20Support,%20I%20need%20help%20with%20my%20order.');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (onBack) {
              onBack();
            } else if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(customer)/(tabs)' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help & Support Center</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* DIRECT WHATSAPP SUPPORT HERO CARD */}
        <TouchableOpacity style={styles.whatsappCard} onPress={handleOpenWhatsApp} activeOpacity={0.9}>
          <View style={styles.whatsappIconCircle}>
            <MessageSquare size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.whatsappTitle}>Direct WhatsApp Operations Support</Text>
            <Text style={styles.whatsappSub}>Chat live with our Vijayawada operations team (+91 98765 43210)</Text>
          </View>
        </TouchableOpacity>

        {/* FAQ ACCORDION LIST */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <View key={idx} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFaq(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  {isExpanded ? <ChevronUp size={18} color="#666" /> : <ChevronDown size={18} color="#666" />}
                </TouchableOpacity>

                {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </View>
            );
          })}
        </View>

        {/* ACTIVE SUPPORT TICKETS CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.ticketHeaderRow}>
            <Text style={styles.sectionTitle}>Your Support Tickets</Text>
            <TouchableOpacity style={styles.newTicketBtn} activeOpacity={0.8}>
              <PlusCircle size={14} color={ColorTokens.deepBerry} />
              <Text style={styles.newTicketText}>New Ticket</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ticketRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ticketSubject}>Ticket #TCK-9281 · Delivery delay</Text>
              <Text style={styles.ticketStatusText}>Status: Resolved by Support Team</Text>
            </View>
            <CheckCircle2 size={18} color={ColorTokens.softGreen} />
          </View>
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
  whatsappCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#C8E8D5',
  },
  whatsappIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorTokens.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  whatsappSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderColor: '#F5EFEF',
    paddingBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  faqQuestion: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.mainText,
    flex: 1,
    paddingRight: 8,
  },
  faqAnswer: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 17,
    color: ColorTokens.secondaryText,
    marginTop: 6,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newTicketText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.deepBerry,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 10,
  },
  ticketSubject: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  ticketStatusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
});
