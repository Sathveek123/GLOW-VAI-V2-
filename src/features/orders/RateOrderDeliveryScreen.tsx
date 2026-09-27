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
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Star,
  Check,
  MessageSquare,
  CheckCircle2,
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

export interface RateOrderDeliveryScreenProps {
  onBack?: () => void;
  onSubmitSuccess?: () => void;
}

export const RateOrderDeliveryScreen: React.FC<RateOrderDeliveryScreenProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [riderRating, setRiderRating] = useState<number>(5);
  const [productRating, setProductRating] = useState<number>(5);
  const [selectedRiderTags, setSelectedRiderTags] = useState<string[]>(['Friendly', 'Fast']);
  const [selectedProdTags, setSelectedProdTags] = useState<string[]>(['Fresh packaging']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const riderTagsList = ['Friendly', 'Fast', 'Careful', 'Professional'];
  const prodTagsList = ['Fresh packaging', 'Loved the product', 'Great value'];

  const toggleRiderTag = (tag: string) => {
    setSelectedRiderTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleProdTag = (tag: string) => {
    setSelectedProdTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      if (onSubmitSuccess) onSubmitSuccess();
      else router.push('/orders' as any);
    }, 1200);
  };

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
          <Text style={styles.headerTitle}>Rate Delivery & Products</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {submitted ? (
          /* THANK YOU SUCCESS CARD */
          <View style={styles.thankYouCard}>
            <View style={styles.thankYouIconCircle}>
              <CheckCircle2 size={40} color={ColorTokens.successGreen} />
            </View>
            <Text style={styles.thankYouTitle}>Thank you!</Text>
            <Text style={styles.thankYouSub}>
              Your feedback helps us deliver a better GlowVAI experience, every time.
            </Text>
          </View>
        ) : (
          <>
            {/* ORDER SUMMARY CARD */}
            <View style={styles.orderSummaryCard}>
              <View style={styles.thumbsRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
                  }}
                  style={styles.summaryThumb}
                />
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=150&q=80',
                  }}
                  style={styles.summaryThumb}
                />
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=150&q=80',
                  }}
                  style={styles.summaryThumb}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.summaryOrderId}>#GV28491</Text>
                <Text style={styles.summaryTime}>Delivered 4:32 PM · Apr 26, 2025</Text>
              </View>
            </View>

            {/* RIDER RATING CARD */}
            <View style={styles.ratingCard}>
              <Text style={styles.ratingCardTitle}>Rate your delivery partner</Text>
              
              <View style={styles.riderRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  }}
                  style={styles.riderAvatar}
                />
                <View>
                  <Text style={styles.riderName}>Rahul</Text>
                  <Text style={styles.riderSub}>GlowVAI Express Rider</Text>
                </View>
              </View>

              {/* 5 STAR CONTROLS */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRiderRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={32}
                      color="#FFD700"
                      fill={star <= riderRating ? '#FFD700' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.ratingScoreText}>{riderRating}.0</Text>
              </View>

              {/* RIDER TAG CHIPS */}
              <View style={styles.tagsRow}>
                {riderTagsList.map((tag) => {
                  const isSel = selectedRiderTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, isSel && styles.tagChipSelected]}
                      onPress={() => toggleRiderTag(tag)}
                      activeOpacity={0.8}
                    >
                      {isSel && <Check size={12} color={ColorTokens.deepBerry} />}
                      <Text style={[styles.tagText, isSel && styles.tagTextSelected]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* PRODUCT EXPERIENCE CARD */}
            <View style={styles.ratingCard}>
              <Text style={styles.ratingCardTitle}>How do you like your products?</Text>

              {/* 5 STAR CONTROLS */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setProductRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={32}
                      color="#FFD700"
                      fill={star <= productRating ? '#FFD700' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={styles.ratingScoreText}>{productRating}.0</Text>
              </View>

              {/* PRODUCT TAG CHIPS */}
              <View style={styles.tagsRow}>
                {prodTagsList.map((tag) => {
                  const isSel = selectedProdTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, isSel && styles.tagChipSelectedPlum]}
                      onPress={() => toggleProdTag(tag)}
                      activeOpacity={0.8}
                    >
                      {isSel && <Check size={12} color={ColorTokens.plum} />}
                      <Text style={[styles.tagText, isSel && styles.tagTextSelectedPlum]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* OPTIONAL COMMENT FIELD */}
            <View style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <MessageSquare size={16} color={ColorTokens.mutedText} />
                <Text style={styles.commentTitle}>Tell us more (optional)</Text>
                <Text style={styles.charCount}>{comment.length}/250</Text>
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Share feedback on packaging, speed, or product quality..."
                placeholderTextColor={ColorTokens.mutedText}
                multiline
                numberOfLines={3}
                maxLength={250}
                value={comment}
                onChangeText={setComment}
              />
            </View>
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      {!submitted && (
        <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Submit Rating</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      )}
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
  orderSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  thumbsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  summaryThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: ColorTokens.softCream,
  },
  summaryOrderId: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  summaryTime: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  ratingCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 12,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  riderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  riderName: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  riderSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  ratingScoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
    marginLeft: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softCream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  tagChipSelected: {
    backgroundColor: ColorTokens.softCoral,
    borderColor: ColorTokens.deepBerry,
  },
  tagChipSelectedPlum: {
    backgroundColor: ColorTokens.lavender,
    borderColor: ColorTokens.plum,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  tagTextSelected: {
    color: ColorTokens.deepBerry,
    fontWeight: '800',
  },
  tagTextSelectedPlum: {
    color: ColorTokens.plum,
    fontWeight: '800',
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  commentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.text,
    flex: 1,
  },
  charCount: {
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  commentInput: {
    fontSize: 13,
    color: ColorTokens.text,
    textAlignVertical: 'top',
    height: 70,
  },
  thankYouCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  thankYouIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: ColorTokens.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  thankYouTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 8,
  },
  thankYouSub: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 20,
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
    gap: 10,
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
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
