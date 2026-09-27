import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Mail,
  Building,
  UploadCloud,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle,
  FileCheck,
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

export interface StudentVerificationScreenProps {
  onBack?: () => void;
  onSubmitSuccess?: () => void;
}

export const StudentVerificationScreen: React.FC<StudentVerificationScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleUploadSim = () => {
    setUploadedFile('student_id_card_ananya.jpg');
    if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid college email address.';
    }
    if (!collegeName.trim()) {
      errs.collegeName = 'Please enter your college or university name.';
    }
    if (!uploadedFile) {
      errs.file = 'Please upload a valid college ID.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitSuccess) onSubmitSuccess();
      else router.push('/referrals' as any);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
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
          <Text style={styles.headerTitle}>Student Verification</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* ILLUSTRATION CARD */}
        <View style={styles.illustrationCard}>
          <View style={styles.illusCircleBg} />
          <View style={styles.gradIconCircle}>
            <GraduationCap size={36} color={ColorTokens.deepBerry} />
          </View>
          <View style={styles.beautyBoxBadge}>
            <Sparkles size={14} color={ColorTokens.coral} />
            <Text style={styles.beautyBoxText}>Student Perks Active</Text>
          </View>
        </View>

        {/* HEADLINE & SUBTITLE */}
        <Text style={styles.headline}>Unlock your student glow perks</Text>
        <Text style={styles.subtitle}>
          Verify once to get extra Glow Coins and student-only offers.
        </Text>

        {/* FORM FIELDS */}
        <Text style={styles.sectionTitle}>VERIFICATION DETAILS</Text>

        {/* 1. College Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>College / University email *</Text>
          <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
            <Mail size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="name@college.edu"
              placeholderTextColor={ColorTokens.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
            />
          </View>
          {errors.email && (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={ColorTokens.deepBerry} />
              <Text style={styles.errorText}>{errors.email}</Text>
            </View>
          )}
        </View>

        {/* 2. College Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>College name *</Text>
          <View style={[styles.inputWrapper, errors.collegeName && styles.inputError]}>
            <Building size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your college or university name"
              placeholderTextColor={ColorTokens.mutedText}
              value={collegeName}
              onChangeText={(text) => {
                setCollegeName(text);
                if (errors.collegeName) setErrors((prev) => ({ ...prev, collegeName: '' }));
              }}
            />
          </View>
          {errors.collegeName && (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={ColorTokens.deepBerry} />
              <Text style={styles.errorText}>{errors.collegeName}</Text>
            </View>
          )}
        </View>

        {/* 3. Upload College ID */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Upload College ID *</Text>
          {uploadedFile ? (
            <View style={styles.uploadedCard}>
              <FileCheck size={24} color={ColorTokens.successGreen} />
              <View style={{ flex: 1 }}>
                <Text style={styles.uploadedFileName}>{uploadedFile}</Text>
                <Text style={styles.uploadedSub}>Ready for submission</Text>
              </View>
              <TouchableOpacity onPress={() => setUploadedFile(null)}>
                <Text style={styles.replaceText}>Replace</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.uploadBox, errors.file && styles.uploadBoxError]}
              onPress={handleUploadSim}
              activeOpacity={0.8}
            >
              <UploadCloud size={28} color={ColorTokens.deepBerry} />
              <Text style={styles.uploadTitle}>Tap to upload or take a photo</Text>
              <Text style={styles.uploadSub}>JPG, PNG, PDF · Max 5 MB</Text>
            </TouchableOpacity>
          )}
          {errors.file && (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={ColorTokens.deepBerry} />
              <Text style={styles.errorText}>{errors.file}</Text>
            </View>
          )}
        </View>

        {/* PRIVACY NOTE */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={ColorTokens.plum} />
          <Text style={styles.privacyText}>
            Your documents are reviewed securely and used only for verification.
          </Text>
        </View>

        {/* CONSENT CHECKBOX */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setConfirmed(!confirmed)}
          activeOpacity={0.8}
        >
          {confirmed ? (
            <CheckSquare size={20} color={ColorTokens.deepBerry} />
          ) : (
            <Square size={20} color={ColorTokens.border} />
          )}
          <Text style={styles.checkboxLabel}>I confirm these details are mine</Text>
        </TouchableOpacity>

        {/* REVIEW TIME NOTE */}
        <Text style={styles.reviewTimeText}>Usually reviewed within 24 hours</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY BOTTOM PRIMARY CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !confirmed && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.9}
          disabled={!confirmed || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit for Verification →</Text>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  illustrationCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 24,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  illusCircleBg: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: ColorTokens.softCoral,
    opacity: 0.3,
  },
  gradIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  beautyBoxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.lavender,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  beautyBoxText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.plum,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  inputError: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: '#FFF0F2',
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: ColorTokens.text,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorTokens.deepBerry,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: ColorTokens.deepBerry,
    borderStyle: 'dashed',
  },
  uploadBoxError: {
    borderColor: ColorTokens.coral,
    backgroundColor: '#FFF0F2',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
    marginTop: 8,
  },
  uploadSub: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  uploadedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softGreen,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(21, 148, 71, 0.3)',
    gap: 10,
  },
  uploadedFileName: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  uploadedSub: {
    fontSize: 11,
    color: ColorTokens.text,
    marginTop: 1,
  },
  replaceText: {
    fontSize: 12,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
    marginBottom: 14,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.plum,
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  reviewTimeText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    textAlign: 'center',
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
  submitBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: ColorTokens.border,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
