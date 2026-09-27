import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react-native';
import { Colors } from '../../../design/tokens';

export function WebFooter() {
  const router = useRouter();

  return (
    <View style={styles.footerContainer}>
      {/* 1. Value Proposition Banner */}
      <View style={styles.valuePropBanner}>
        <View style={styles.valuePropInner}>
          <View style={styles.valueItem}>
            <Clock size={24} color="#FFD700" />
            <View>
              <Text style={styles.valueTitle}>10-Minute Express Delivery</Text>
              <Text style={styles.valueSub}>Dispatched from PIP Vijayawada darkstore</Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <ShieldCheck size={24} color="#FFD700" />
            <View>
              <Text style={styles.valueTitle}>100% Authentic Formulations</Text>
              <Text style={styles.valueSub}>Direct from Minimalist, Derma Co, Cetaphil</Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <Sparkles size={24} color="#FFD700" />
            <View>
              <Text style={styles.valueTitle}>AI Clinical Match</Text>
              <Text style={styles.valueSub}>Computer vision pore & barrier analysis</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Main 4-Column Links Grid */}
      <View style={styles.mainFooter}>
        <View style={styles.mainFooterInner}>
          {/* Col 1: Brand & App Download */}
          <View style={styles.footerColBig}>
            <Text style={styles.brandTitle}>glowvai</Text>
            <Text style={styles.brandTagline}>
              India's #1 Clinical Skincare & 10-Minute Darkstore Delivery Platform.
            </Text>

            <Text style={styles.downloadHeading}>Get the Full Mobile Experience</Text>
            <View style={styles.badgeRow}>
              <TouchableOpacity
                style={styles.appStoreBadge}
                onPress={() => router.push('/(customer)/scan/camera')}
                activeOpacity={0.8}
              >
                <Text style={styles.badgeText}>App Store </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.appStoreBadge}
                onPress={() => router.push('/(customer)/scan/camera')}
                activeOpacity={0.8}
              >
                <Text style={styles.badgeText}>Google Play ▶</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Col 2: Clinical Categories */}
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>Categories</Text>
            <Text style={styles.colLink}>Active Serums & Concentrates</Text>
            <Text style={styles.colLink}>Facial Creams & Barrier Repair</Text>
            <Text style={styles.colLink}>Ointments & Healing Salves</Text>
            <Text style={styles.colLink}>Gentle Lotions & Cleansers</Text>
            <Text style={styles.colLink}>Zero-Cast Sunscreens</Text>
          </View>

          {/* Col 3: Customer Care & Policies */}
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>Customer Care</Text>
            <Text style={styles.colLink}>Track Your Express Order</Text>
            <Text style={styles.colLink}>10-Min Darkstore Network</Text>
            <Text style={styles.colLink}>Refund & Returns Policy</Text>
            <Text style={styles.colLink}>AI Face Scan Privacy</Text>
            <Text style={styles.colLink}>Support Hub & WhatsApp</Text>
          </View>

          {/* Col 4: Corporate & Connect */}
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>Connect With Us</Text>
            <Text style={styles.colLink}>Partner Darkstores</Text>
            <Text style={styles.colLink}>Dermatologist Panel</Text>
            <Text style={styles.colLink}>Careers at GlowVAI</Text>
            <Text style={styles.colLink}>Instagram · @glowvai.express</Text>
            <Text style={styles.colLink}>Press & Media Enquiries</Text>
          </View>
        </View>
      </View>

      {/* 3. Bottom Copyright Bar */}
      <View style={styles.copyrightBar}>
        <View style={styles.copyrightInner}>
          <Text style={styles.copyrightText}>
            © 2026 GlowVAI Technologies Inc. All rights reserved. Built for ultra-fast clinical skincare commerce.
          </Text>
          <View style={styles.paymentBadgeRow}>
            <Text style={styles.paymentBadge}>UPI</Text>
            <Text style={styles.paymentBadge}>GPay</Text>
            <Text style={styles.paymentBadge}>PhonePe</Text>
            <Text style={styles.paymentBadge}>Cards</Text>
            <Text style={styles.paymentBadge}>COD</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    marginTop: 40,
  },
  valuePropBanner: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 20,
  },
  valuePropInner: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: Colors.white,
  },
  valueSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  mainFooter: {
    width: '100%',
    paddingVertical: 40,
  },
  mainFooterInner: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 32,
  },
  footerColBig: {
    flex: 2,
    minWidth: 260,
  },
  footerCol: {
    flex: 1,
    minWidth: 180,
  },
  brandTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.white,
  },
  brandTagline: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 20,
  },
  downloadHeading: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.white,
    marginTop: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  appStoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  colTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 12,
  },
  colLink: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
  },
  copyrightBar: {
    width: '100%',
    backgroundColor: '#090D16',
    paddingVertical: 16,
  },
  copyrightInner: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  copyrightText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  paymentBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentBadge: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#94A3B8',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
