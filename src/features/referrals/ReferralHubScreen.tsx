import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Gift,
  Copy,
  Share2,
  Check,
  GraduationCap,
  ChevronRight,
  Coins,
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
  goldReward: '#DFAE38',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface ReferralHubScreenProps {
  onBack?: () => void;
  onVerifyStudent?: () => void;
}

export const ReferralHubScreen: React.FC<ReferralHubScreenProps> = ({
  onBack,
  onVerifyStudent,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleVerifyStudentAction = () => {
    if (onVerifyStudent) onVerifyStudent();
    else router.push('/student-verify' as any);
  };

  // DESKTOP WIDESCREEN WEB LAYOUT
  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: ColorTokens.warmIvory }}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER */}
        <View style={{ backgroundColor: ColorTokens.deepBerry, paddingVertical: 16, paddingHorizontal: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity
                style={styles.backCircle}
                onPress={onBack || (() => router.back())}
                activeOpacity={0.8}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#FFFFFF' }}>
                Glow Rewards & Student Money Hub
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14 }}>
              <Coins size={18} color="#FFD700" />
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: '#FFFFFF' }}>2,450 Glow Coins (₹245)</Text>
            </View>
          </View>
        </View>

        {/* MAIN WIDESCREEN CONTAINER */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: 32 }}>
            
            {/* LEFT COLUMN: HERO & LINK (60%) */}
            <View style={{ flex: 3, gap: 24 }}>
              {/* HERO BANNER */}
              <View style={{ backgroundColor: ColorTokens.deepBerry, borderRadius: 20, padding: 32, position: 'relative' }}>
                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 12 }}>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 11, color: '#FFFFFF' }}>STUDENT & FRIENDS REFERRAL PROGRAM</Text>
                </View>

                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 28, color: '#FFFFFF' }}>Give ₹100, Get ₹100</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: ColorTokens.softCoral, marginTop: 4 }}>
                  Invite friends to GlowVAI. They get FLAT ₹100 off their first clinical order, and you earn ₹100 Glow Cash instantly!
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 24 }}>
                  <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: ColorTokens.plum, alignItems: 'center', justifyContent: 'center' }}>
                    <Gift size={30} color="#FFFFFF" />
                  </View>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Coins size={26} color="#FFD700" />
                  </View>
                </View>
              </View>

              {/* INVITE LINK BOX */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: ColorTokens.border }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.text, marginBottom: 14 }}>YOUR EXCLUSIVE INVITE LINK</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: ColorTokens.softCream, borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: ColorTokens.border }}>
                  <Text style={{ flex: 1, fontFamily: 'Poppins-Bold', fontSize: 14, color: ColorTokens.text }}>glowvai.in/invite/ANANYA24</Text>
                  <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} activeOpacity={0.8}>
                    {copied ? <Check size={16} color="#FFFFFF" /> : <Copy size={16} color="#FFFFFF" />}
                    <Text style={[styles.copyBtnText, { fontSize: 13 }]}>{copied ? 'Copied Link' : 'Copy Link'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
                  <TouchableOpacity style={[styles.socialBtnWhatsapp, { height: 46, borderRadius: 14 }]} activeOpacity={0.8}>
                    <Share2 size={16} color="#FFFFFF" />
                    <Text style={[styles.socialBtnText, { fontSize: 14 }]}>Share on WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialBtnInstagram, { height: 46, borderRadius: 14 }]} activeOpacity={0.8}>
                    <Share2 size={16} color="#FFFFFF" />
                    <Text style={[styles.socialBtnText, { fontSize: 14 }]}>Share on Instagram</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: COINS & RECENT REFERRALS (40%) */}
            <View style={{ flex: 2, gap: 24 }}>
              {/* BALANCE & PROGRESS */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: ColorTokens.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.coinCircle}>
                      <Coins size={22} color={ColorTokens.goldReward} />
                    </View>
                    <View>
                      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: ColorTokens.text }}>Glow Coins</Text>
                      <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: ColorTokens.mutedText }}>Your beauty currency</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, color: ColorTokens.goldReward }}>2,450</Text>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 12, color: ColorTokens.successGreen }}>₹245 available</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>2,450 / 5,000 Coins</Text>
                    <Text style={styles.nextRewardText}>Next Reward: ₹500</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '49%' }]} />
                  </View>
                </View>
              </View>

              {/* STUDENT VERIFY CARD */}
              <View style={{ backgroundColor: ColorTokens.softCoral, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(242, 127, 120, 0.3)' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <View style={styles.studentIconBg}>
                    <GraduationCap size={24} color={ColorTokens.deepBerry} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: ColorTokens.deepBerry }}>Student Verification</Text>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: ColorTokens.mutedText, marginTop: 2 }}>Unlock extra Glow Coins per successful invite</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.verifyStudentBtn} onPress={handleVerifyStudentAction} activeOpacity={0.85}>
                  <Text style={styles.verifyStudentText}>Verify Student Status →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Glow Rewards</Text>
        </View>

        <View style={styles.sparkleIconCircle}>
          <Sparkles size={18} color="#FFD700" />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* REFERRAL HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Text style={styles.heroBadgeText}>REFERRAL HUB</Text>
          </View>

          <Text style={styles.heroHeadline}>Give ₹100, Get ₹100</Text>
          <Text style={styles.heroSub}>Invite friends and earn Glow Coins</Text>

          {/* GIFT BOX & GOLD COINS VISUAL */}
          <View style={styles.heroVisualRow}>
            <View style={styles.giftIconBg}>
              <Gift size={32} color="#FFFFFF" />
            </View>
            <View style={styles.coinsIconBg}>
              <Coins size={28} color="#FFD700" />
            </View>
            <View style={styles.sparkleBadge}>
              <Sparkles size={16} color={ColorTokens.coral} />
            </View>
          </View>
        </View>

        {/* GLOW COINS BALANCE CARD */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.coinCircle}>
              <Coins size={20} color={ColorTokens.goldReward} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.balanceLabel}>Glow Coins</Text>
              <Text style={styles.balanceSub}>Your beauty currency</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.balanceValue}>2,450</Text>
              <Text style={styles.balanceInRupees}>₹245 available</Text>
            </View>
          </View>

          {/* REWARDS PROGRESS BAR */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>2,450 / 5,000</Text>
              <Text style={styles.nextRewardText}>Next reward: ₹500</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '49%' }]} />
            </View>
            <Text style={styles.progressFootnote}>
              You’re 2,550 Glow Coins away from your next reward.
            </Text>
          </View>
        </View>

        {/* INVITE LINK CARD */}
        <View style={styles.inviteCard}>
          <Text style={styles.sectionTitle}>YOUR INVITE LINK</Text>
          <View style={styles.linkBox}>
            <Text style={styles.linkText}>glowvai.in/invite/ANANYA24</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} activeOpacity={0.8}>
              {copied ? <Check size={14} color="#FFFFFF" /> : <Copy size={14} color="#FFFFFF" />}
              <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>

          {/* SOCIAL SHARE BUTTONS */}
          <View style={styles.shareBtnsRow}>
            <TouchableOpacity style={styles.socialBtnWhatsapp} activeOpacity={0.8}>
              <Share2 size={14} color="#FFFFFF" />
              <Text style={styles.socialBtnText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtnInstagram} activeOpacity={0.8}>
              <Share2 size={14} color="#FFFFFF" />
              <Text style={styles.socialBtnText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STUDENT REWARDS CARD */}
        <View style={styles.studentCard}>
          <View style={styles.studentHeader}>
            <View style={styles.studentIconBg}>
              <GraduationCap size={22} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentTitle}>Students get extra Glow Coins</Text>
              <Text style={styles.studentSub}>
                Verify your student status and unlock special rewards.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.verifyStudentBtn}
            onPress={handleVerifyStudentAction}
            activeOpacity={0.85}
          >
            <Text style={styles.verifyStudentText}>Verify Student Status →</Text>
          </TouchableOpacity>
        </View>

        {/* REFERRAL HISTORY */}
        <Text style={styles.sectionTitle}>REFERRAL HISTORY</Text>
        <View style={styles.historyCard}>
          {[
            { name: 'Priya Sharma', time: 'Joined 2 days ago', amount: '+₹100' },
            { name: 'Riya Verma', time: 'Joined 4 days ago', amount: '+₹100' },
            { name: 'Arjun Mehta', time: 'Joined 6 days ago', amount: '+₹100' },
          ].map((item, idx, arr) => (
            <View key={idx}>
              <View style={styles.historyRow}>
                <View style={styles.historyAvatar}>
                  <Text style={styles.avatarLetter}>{item.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyName}>{item.name}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>
                <Text style={styles.historyAmount}>{item.amount}</Text>
              </View>
              {idx < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  sparkleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: ColorTokens.deepBerry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  heroHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 14,
    color: ColorTokens.softCoral,
    marginBottom: 16,
  },
  heroVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftIconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: ColorTokens.plum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  coinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  balanceSub: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 1,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorTokens.goldReward,
  },
  balanceInRupees: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorTokens.successGreen,
  },
  progressContainer: {
    backgroundColor: ColorTokens.softCream,
    padding: 12,
    borderRadius: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  nextRewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: ColorTokens.border,
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ColorTokens.goldReward,
    borderRadius: 3,
  },
  progressFootnote: {
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  inviteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCream,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shareBtnsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtnWhatsapp: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: ColorTokens.successGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  socialBtnInstagram: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: ColorTokens.plum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentCard: {
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  studentIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  studentSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  verifyStudentBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyStudentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  historyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.plum,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  historyTime: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 1,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
  },
});
