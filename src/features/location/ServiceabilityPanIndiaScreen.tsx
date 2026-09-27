import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Search,
  ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  lavender: '#F2ECFA',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface ServiceabilityPanIndiaScreenProps {
  onBack?: () => void;
  onStartShopping?: () => void;
}

export const ServiceabilityPanIndiaScreen: React.FC<ServiceabilityPanIndiaScreenProps> = ({
  onBack,
  onStartShopping,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    days: string;
    location: string;
  } | null>(null);

  const handleCheckPincode = () => {
    if (pincode.trim().length !== 6) return;
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setPincodeResult({
        valid: true,
        days: '3–5 Business Days',
        location: `Pincode ${pincode} · Standard Shipping Available`,
      });
    }, 600);
  };

  const handleStartShopping = () => {
    if (onStartShopping) {
      onStartShopping();
    } else {
      router.push('/(customer)/(tabs)/shop' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER WITH SAFE TOP INSET */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Pan-India Shipping</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO PAN-INDIA BANNER */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Truck size={14} color={ColorTokens.deepBerry} />
            <Text style={styles.heroBadgeText}>NATIONWIDE COVERAGE</Text>
          </View>
          <Text style={styles.heroTitle}>Pan-India Delivery in 3–7 Days</Text>
          <Text style={styles.heroSub}>
            Delivering authentic GlowVAI beauty products to 27,000+ pincodes across India via premium courier partners.
          </Text>

          <View style={styles.courierRow}>
            <View style={styles.courierPill}>
              <CheckCircle2 size={12} color={ColorTokens.successGreen} />
              <Text style={styles.courierText}>BlueDart & Bluedart Express</Text>
            </View>
            <View style={styles.courierPill}>
              <CheckCircle2 size={12} color={ColorTokens.successGreen} />
              <Text style={styles.courierText}>Delhivery Air</Text>
            </View>
          </View>
        </View>

        {/* PINCODE CHECKER */}
        <View style={styles.pincodeCard}>
          <Text style={styles.cardLabel}>CHECK DELIVERY ESTIMATE</Text>
          <View style={styles.inputRow}>
            <MapPin size={18} color={ColorTokens.mutedText} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.pincodeInput}
              placeholder="Enter 6-digit Pincode"
              placeholderTextColor={ColorTokens.mutedText}
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
            <TouchableOpacity
              style={[styles.checkBtn, pincode.length !== 6 && styles.checkBtnDisabled]}
              onPress={handleCheckPincode}
              disabled={pincode.length !== 6 || isChecking}
              activeOpacity={0.8}
            >
              {isChecking ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.checkBtnText}>Check</Text>
              )}
            </TouchableOpacity>
          </View>

          {pincodeResult && (
            <View style={styles.resultBox}>
              <CheckCircle2 size={18} color={ColorTokens.successGreen} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{pincodeResult.days}</Text>
                <Text style={styles.resultSub}>{pincodeResult.location}</Text>
              </View>
            </View>
          )}
        </View>

        {/* DELIVERY TIMELINE BREAKDOWN */}
        <Text style={styles.sectionTitle}>DELIVERY TIMELINE</Text>
        <View style={styles.timelineCard}>
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconBg}>
              <PackageCheck size={18} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineStepTitle}>Dispatch in 24 Hours</Text>
              <Text style={styles.timelineStepDesc}>Fresh batch packed directly from central hub</Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconBg}>
              <Truck size={18} color={ColorTokens.plum} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineStepTitle}>In Transit (2–5 Days)</Text>
              <Text style={styles.timelineStepDesc}>Air & express surface shipping with live GPS tracking</Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconBg}>
              <Clock size={18} color={ColorTokens.successGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineStepTitle}>Safe Doorstep Delivery</Text>
              <Text style={styles.timelineStepDesc}>OTP verified delivery right to your door</Text>
            </View>
          </View>
        </View>

        {/* GUARANTEE CARD */}
        <View style={styles.guaranteeCard}>
          <ShieldCheck size={18} color={ColorTokens.plum} />
          <Text style={styles.guaranteeText}>
            100% Authentic Products · Tamper-proof Packaging · Free Shipping over ₹499
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER WITH SAFE BOTTOM INSET */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStartShopping} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>Start Shopping →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ServiceabilityPanIndiaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  heroBanner: {
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: ColorTokens.mutedText,
    lineHeight: 18,
    marginBottom: 14,
  },
  courierRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  courierText: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  pincodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCream,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  pincodeInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  checkBtn: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDisabled: {
    opacity: 0.4,
  },
  checkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ColorTokens.softGreen,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(21, 148, 71, 0.2)',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  resultSub: {
    fontSize: 12,
    color: ColorTokens.text,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineStepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  timelineStepDesc: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.plum,
    flex: 1,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
  },
  primaryBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
