import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  Plus,
  ShoppingBag,
  Zap,
  RotateCcw,
  Check,
  Star,
  Info,
  Camera,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCartStore } from '../../state/cartStore';
import type { SkinAnalysisResult } from '../../services/skinModelService';
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

export interface SkinReportScreenProps {
  onBack?: () => void;
  onRetake?: () => void;
  onShopRoutine?: () => void;
}

export const SkinReportScreen: React.FC<SkinReportScreenProps> = ({
  onBack,
  onRetake,
  onShopRoutine,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { addItem } = useCartStore();
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  // Real inference result passed from ScanAnalysisScreen
  const params = useLocalSearchParams<{ result?: string }>();

  let analysisResult: SkinAnalysisResult | null = null;
  if (params.result) {
    try {
      analysisResult = JSON.parse(params.result) as SkinAnalysisResult;
    } catch {
      console.warn('[SkinReport] Failed to parse result param');
    }
  }

  const handleAddToCart = (id: string, name: string, price: number, image: string) => {
    addItem({
      productId: id,
      name,
      brand: 'GlowVAI',
      price,
      mrp: price + 300,
      image,
    });
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const handleShopRoutineAction = () => {
    if (onShopRoutine) onShopRoutine();
    else router.push('/(customer)/(tabs)/cart' as any);
  };

  const handleRetakeAction = () => {
    if (onRetake) onRetake();
    else router.push('/scan/camera' as any);
  };

  // ─── EMPTY STATE: User navigates directly to report without a completed scan ───
  if (!analysisResult) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />
        <View style={[styles.header, { paddingTop: headerTopInset }]}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Your Glow Profile</Text>
            <Text style={styles.headerSubtitle}>No active scan found</Text>
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Sparkles size={48} color={ColorTokens.deepBerry} />
          </View>
          <Text style={styles.emptyTitle}>Complete a scan to view your Glow Profile</Text>
          <Text style={styles.emptySub}>
            Capture a clear photo or select an image from your gallery to get your personalized cosmetic skin assessment.
          </Text>

          <TouchableOpacity style={styles.startScanBtn} onPress={handleRetakeAction} activeOpacity={0.85}>
            <Camera size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.startScanBtnText}>Start Scan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── REAL REPORT DATA ───────────────────────────────────────────────────────
  const isLowConfidence = analysisResult.status === 'low_confidence';
  const skinTypeStr = analysisResult.skinProfile.skinType;
  const skinTypeDisplay =
    skinTypeStr === 'uncertain'
      ? 'Uncertain'
      : skinTypeStr.charAt(0).toUpperCase() + skinTypeStr.slice(1) + ' Skin';

  const confidencePct = Math.round(analysisResult.skinProfile.skinTypeConfidence * 100);
  const overallConfPct = Math.round(analysisResult.confidence * 100);

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

        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>Your Glow Profile</Text>
          <Text style={styles.headerSubtitle}>Your personalized cosmetic skin insights</Text>
        </View>

        <TouchableOpacity style={styles.moreCircle} activeOpacity={0.8}>
          <MoreVertical size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* LOW CONFIDENCE BANNER — shown when model is uncertain */}
        {isLowConfidence && (
          <View style={styles.lowConfBanner}>
            <AlertTriangle size={16} color="#B45309" />
            <Text style={styles.lowConfText}>
              Low confidence result — lighting or angle may have affected accuracy. Consider retaking your scan for more precise insights.
            </Text>
          </View>
        )}

        {/* HERO SUMMARY CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.scanCompleteBadge}>
              <CheckCircle2 size={12} color="#FFFFFF" />
              <Text style={styles.scanCompleteText}>
                {isLowConfidence ? 'LOW CONFIDENCE' : 'SCAN COMPLETE'}
              </Text>
            </View>

            <View style={styles.logoMark}>
              <Sparkles size={14} color="#FFD700" />
            </View>
          </View>

          <Text style={styles.eyebrow}>YOUR SKIN PROFILE</Text>
          <Text style={styles.skinTypeResult}>{skinTypeDisplay}</Text>

          {/* CONFIDENCE BAR — real confidence from model */}
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>{confidencePct}% confidence</Text>
            <View style={styles.confidenceBarBg}>
              <View style={[styles.confidenceBarFill, { width: `${confidencePct}%` as any }]} />
            </View>
          </View>

          <Text style={styles.heroDesc}>
            {skinTypeStr === 'uncertain'
              ? 'The scan could not determine a confident skin type. Try retaking in better lighting.'
              : skinTypeStr === 'combination'
              ? 'Your T-zone appears more oil-prone while your cheeks appear more dry-looking.'
              : skinTypeStr === 'oily'
              ? 'Your skin shows signs of increased sebum production across multiple zones.'
              : skinTypeStr === 'dry'
              ? 'Your skin appears to lack sufficient moisture and hydration.'
              : 'Your skin shows balanced characteristics across most zones.'}
          </Text>
        </View>

        {/* QUICK METRICS CARDS */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Confidence</Text>
            <Text style={styles.metricValue}>{overallConfPct}%</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Concerns Found</Text>
            <Text style={styles.metricValue}>
              {analysisResult.concerns.filter((c) => c.present).length}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Model Version</Text>
            <Text style={styles.metricValuePlum} numberOfLines={1}>
              {analysisResult.modelVersion ?? 'v1 ONNX'}
            </Text>
          </View>
        </View>

        {/* VISIBLE SKIN INSIGHTS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Visible Skin Insights</Text>
          <Text style={styles.sectionHelper}>Cosmetic observations</Text>
        </View>

        {/* CONCERNS LIST FROM ONNX MODEL */}
        {analysisResult.concerns.map((concern) => {
          const scorePct = Math.round((concern.score ?? 0.5) * 100);
          return (
            <View key={concern.key} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View
                  style={[
                    styles.insightIconBg,
                    {
                      backgroundColor: concern.present
                        ? ColorTokens.softCoral
                        : ColorTokens.softGreen,
                    },
                  ]}
                >
                  <Sparkles
                    size={18}
                    color={
                      concern.present ? ColorTokens.deepBerry : ColorTokens.successGreen
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightName}>{concern.label}</Text>
                  <Text style={styles.insightSub}>
                    {concern.present
                      ? `Observed condition (${scorePct}% score)`
                      : 'Minimal/Not detected'}
                  </Text>
                </View>
                <View
                  style={concern.present ? styles.obsBadge : styles.obsBadgeMild}
                >
                  <Text
                    style={
                      concern.present
                        ? styles.obsBadgeText
                        : styles.obsBadgeMildText
                    }
                  >
                    {concern.present ? 'Observed' : 'Normal'}
                  </Text>
                </View>
              </View>
              <View style={styles.insightProgressBg}>
                <View
                  style={[
                    styles.insightProgressFill,
                    {
                      width: `${scorePct}%` as any,
                      backgroundColor: concern.present
                        ? ColorTokens.deepBerry
                        : ColorTokens.successGreen,
                    },
                  ]}
                />
              </View>
              <Text style={styles.confidenceFootnote}>{scorePct}% scan confidence score</Text>
            </View>
          );
        })}

        {/* FACE ZONE SUMMARY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Face Zone Summary</Text>
        </View>

        <View style={styles.faceZoneCard}>
          <View style={styles.faceDiagramContainer}>
            <View style={styles.faceOval}>
              <View
                style={[
                  styles.zoneDot,
                  { top: 25, left: 35, backgroundColor: ColorTokens.deepBerry },
                ]}
              />
              <View
                style={[
                  styles.zoneDot,
                  { top: 60, left: 15, backgroundColor: ColorTokens.successGreen },
                ]}
              />
              <View
                style={[
                  styles.zoneDot,
                  { top: 60, right: 15, backgroundColor: ColorTokens.plum },
                ]}
              />
            </View>
          </View>

          <View style={styles.zoneLegendList}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: ColorTokens.deepBerry }]} />
              <Text style={styles.legendText}>T-zone — Sebum observation</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: ColorTokens.successGreen }]} />
              <Text style={styles.legendText}>Cheeks — Hydration observation</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: ColorTokens.plum }]} />
              <Text style={styles.legendText}>Periorbital — Texture observation</Text>
            </View>
            <Text style={styles.faceZoneNote}>
              Highlighted areas are cosmetic observations derived from the scan frame.
            </Text>
          </View>
        </View>

        {/* YOUR SIMPLE ROUTINE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Simple Routine</Text>
        </View>

        <View style={styles.routineGrid}>
          <View style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Sun size={16} color={ColorTokens.coral} />
              <Text style={styles.routineTitle}>Morning</Text>
            </View>
            <Text style={styles.stepText}>1. Cleanse gently</Text>
            <Text style={styles.stepText}>2. Apply lightweight moisturizer</Text>
            <Text style={styles.stepText}>3. Use SPF 30+</Text>
          </View>

          <View style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Moon size={16} color={ColorTokens.plum} />
              <Text style={styles.routineTitle}>Night</Text>
            </View>
            <Text style={styles.stepText}>1. Double cleanse</Text>
            <Text style={styles.stepText}>2. Apply hydrating serum</Text>
            <Text style={styles.stepText}>3. Lock in night cream</Text>
          </View>
        </View>

        {/* RECOMMENDED FOR YOU PRODUCTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
        </View>

        <View style={styles.productsCol}>
          <View style={styles.productCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.productImg}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.expressBadge}>
                <Zap size={10} color={ColorTokens.deepBerry} />
                <Text style={styles.expressText}>10 MIN EXPRESS</Text>
              </View>
              <Text style={styles.productName}>GlowVAI Radiant Balance Face Serum</Text>
              <Text style={styles.productBen}>Balances oil · Hydrates · Evens tone</Text>

              <View style={styles.priceRow}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>4.8</Text>
                <Text style={styles.priceText}>₹699</Text>

                <TouchableOpacity
                  style={[styles.addBtn, addedItems['p1'] && styles.addBtnDone]}
                  onPress={() =>
                    handleAddToCart(
                      'p1',
                      'GlowVAI Radiant Balance Face Serum',
                      699,
                      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80'
                    )
                  }
                  activeOpacity={0.8}
                >
                  {addedItems['p1'] ? (
                    <Check size={14} color="#FFFFFF" />
                  ) : (
                    <Plus size={14} color="#FFFFFF" />
                  )}
                  <Text style={styles.addBtnText}>{addedItems['p1'] ? 'Added' : 'ADD'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.productCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.productImg}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.expressBadge}>
                <Zap size={10} color={ColorTokens.deepBerry} />
                <Text style={styles.expressText}>10 MIN EXPRESS</Text>
              </View>
              <Text style={styles.productName}>GlowVAI Barrier Repair Moisturizer</Text>
              <Text style={styles.productBen}>Hydrates · Soothes · Strengthens</Text>

              <View style={styles.priceRow}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>4.7</Text>
                <Text style={styles.priceText}>₹599</Text>

                <TouchableOpacity
                  style={[styles.addBtn, addedItems['p2'] && styles.addBtnDone]}
                  onPress={() =>
                    handleAddToCart(
                      'p2',
                      'GlowVAI Barrier Repair Moisturizer',
                      599,
                      'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80'
                    )
                  }
                  activeOpacity={0.8}
                >
                  {addedItems['p2'] ? (
                    <Check size={14} color="#FFFFFF" />
                  ) : (
                    <Plus size={14} color="#FFFFFF" />
                  )}
                  <Text style={styles.addBtnText}>{addedItems['p2'] ? 'Added' : 'ADD'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* DISCLAIMER CARD */}
        <View style={styles.disclaimerCard}>
          <Info size={16} color="#B8860B" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.disclaimerTitle}>
              This is a cosmetic skin assessment, not a medical diagnosis.
            </Text>
            <Text style={styles.disclaimerText}>
              Results can vary with lighting, camera quality, makeup, and position. For persistent or concerning skin changes, consult a qualified dermatologist.
            </Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleRetakeAction}
          activeOpacity={0.8}
        >
          <RotateCcw size={16} color={ColorTokens.deepBerry} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryBtnText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleShopRoutineAction}
          activeOpacity={0.9}
        >
          <ShoppingBag size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Shop This Routine</Text>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ColorTokens.softCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorTokens.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySub: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  startScanBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startScanBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
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
  headerTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: ColorTokens.softCoral,
    marginTop: 2,
  },
  moreCircle: {
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
  lowConfBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3E2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  lowConfText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#B45309',
    lineHeight: 18,
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
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scanCompleteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scanCompleteText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.softCoral,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  skinTypeResult: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  confidenceRow: {
    marginBottom: 12,
  },
  confidenceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  confidenceBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  heroDesc: {
    fontSize: 13,
    color: ColorTokens.softCoral,
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  metricTitle: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  metricValuePlum: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.plum,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  sectionHelper: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  insightIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightName: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  insightSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  obsBadge: {
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  obsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  obsBadgeMild: {
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  obsBadgeMildText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  insightProgressBg: {
    height: 4,
    backgroundColor: ColorTokens.lavender,
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  insightProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceFootnote: {
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  faceZoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 16,
  },
  faceDiagramContainer: {
    width: 90,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOval: {
    width: 75,
    height: 98,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: ColorTokens.border,
    position: 'relative',
    backgroundColor: ColorTokens.softCream,
  },
  zoneDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  zoneLegendList: {
    flex: 1,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  faceZoneNote: {
    fontSize: 10,
    color: ColorTokens.mutedText,
    marginTop: 4,
    lineHeight: 14,
  },
  routineGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  routineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  routineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  stepText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginBottom: 6,
  },
  productsCol: {
    gap: 12,
    marginBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  productImg: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: ColorTokens.softCream,
  },
  expressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ColorTokens.softCoral,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  expressText: {
    fontSize: 9,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  productName: {
    fontSize: 13,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  productBen: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 2,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
    marginLeft: 6,
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addBtnDone: {
    backgroundColor: ColorTokens.successGreen,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBE6',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE58F',
    gap: 10,
    marginBottom: 20,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8C6B00',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#8C6B00',
    lineHeight: 16,
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
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  primaryBtn: {
    flex: 2,
    height: 50,
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
