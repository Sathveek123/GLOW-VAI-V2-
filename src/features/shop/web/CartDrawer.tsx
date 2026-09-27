import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Trash2, Zap, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../../../design/tokens';
import { Typography } from '../../../design/typography';
import { useCartStore } from '../../../state/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items: itemsRecord, totalCount, totalPrice, mrpTotal, savings, incrementItem, decrementItem, removeItem } = useCartStore();
  const itemsList = Object.values(itemsRecord || {});

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <View style={styles.drawerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <ShoppingBag size={20} color={Colors.cartMaroon} />
            <Text style={styles.headerTitle}>Shopping Cart ({totalCount})</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
            <X size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Express Delivery Banner */}
        <View style={styles.deliveryBanner}>
          <Zap size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.deliveryBannerText}>
            ⚡ 10-Minute Darkstore Express Delivery to Vijayawada
          </Text>
        </View>

        {/* Items List */}
        {itemsList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyTitle}>Your cart is currently empty</Text>
            <Text style={styles.emptySub}>Explore our 500+ clinical skincare products and add items to your cart.</Text>
          </View>
        ) : (
          <ScrollView style={styles.itemsScroll} showsVerticalScrollIndicator={false}>
            {itemsList.map((item) => (
              <View key={item.productId} style={styles.itemRow}>
                {/* Item Thumbnail */}
                <View style={styles.itemThumbWrap}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 60, height: 60, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </View>

                {/* Details */}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                    {item.mrp && item.mrp > item.price && (
                      <Text style={styles.itemMrp}>₹{item.mrp * item.quantity}</Text>
                    )}
                  </View>
                </View>

                {/* Stepper & Trash */}
                <View style={styles.stepperCol}>
                  <View style={styles.stepperBox}>
                    <TouchableOpacity
                      onPress={() => decrementItem(item.productId)}
                      style={styles.stepperBtn}
                    >
                      <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.stepperCount}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => incrementItem(item.productId)}
                      style={styles.stepperBtn}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeItem(item.productId)}
                    style={styles.trashBtn}
                  >
                    <Trash2 size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Footer Summary */}
        {itemsList.length > 0 && (
          <View style={styles.footer}>
            {savings > 0 && (
              <View style={styles.savingsPill}>
                <Text style={styles.savingsText}>🎉 You saved ₹{savings} on this order!</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items MRP Total</Text>
              <Text style={styles.summaryValue}>₹{mrpTotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Express Delivery Fee</Text>
              <Text style={styles.freeText}>FREE (10 Mins)</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payable Amount</Text>
              <Text style={styles.totalValue}>₹{totalPrice}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => {
                onClose();
                router.push('/(customer)/express-checkout' as any);
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Express Checkout</Text>
              <ArrowRight size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    width: 420,
    height: '100%',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border as any,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cartMaroon,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  deliveryBannerText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  itemsScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border as any,
    gap: 12,
  },
  itemThumbWrap: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F4F5F7',
  },
  itemDetails: {
    flex: 1,
  },
  itemBrand: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  itemName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  itemPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  itemMrp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  stepperCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border as any,
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepperBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: Colors.cartMaroon,
  },
  stepperCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: Colors.textPrimary,
    paddingHorizontal: 6,
  },
  trashBtn: {
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border as any,
    backgroundColor: '#FAF9F6',
  },
  savingsPill: {
    backgroundColor: 'rgba(45,157,95,0.12)',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  savingsText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.success,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  freeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: Colors.success,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border as any,
  },
  totalLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.cartMaroon,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cartMaroon,
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  checkoutBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: Colors.white,
  },
});
