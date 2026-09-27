import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useCartStore as useZustandCartStore } from '../../state/cartStore';
import { safeHapticImpact } from '../../utils/haptics';

interface AddToCartButtonProps {
  productId: string;
  product?: {
    id: string;
    name: string;
    brand?: string;
    image?: string;
    price: number;
    mrp?: number;
  };
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  product,
  size = 'medium',
  style,
}) => {
  const cartItem = useZustandCartStore((state) => state.items[productId]);
  const addItem = useZustandCartStore((state) => state.addItem);
  const incrementItem = useZustandCartStore((state) => state.incrementItem);
  const decrementItem = useZustandCartStore((state) => state.decrementItem);

  const quantity = cartItem?.quantity || 0;

  const handleAdd = async (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    await safeHapticImpact();

    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        brand: product.brand || 'GlowVAI',
        image:
          typeof product.image === 'string'
            ? product.image
            : 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
        price: product.price,
        mrp: product.mrp,
      });
    } else {
      incrementItem(productId);
    }
  };

  const handleIncrement = async (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    await safeHapticImpact();
    incrementItem(productId);
  };

  const handleDecrement = async (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    await safeHapticImpact();
    decrementItem(productId);
  };

  // 1. In Cart Stepper (-  1  +)
  if (quantity > 0) {
    return (
      <View style={[styles.stepperContainer, size === 'small' && styles.stepperSmall, style]}>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={handleDecrement}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Minus size={size === 'small' ? 12 : 14} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>

        <Text style={[styles.stepperQtyText, size === 'small' && styles.qtySmall]}>
          {quantity}
        </Text>

        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={handleIncrement}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Plus size={size === 'small' ? 12 : 14} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Default JioMart / Zepto Style Broad Rectangular "ADD" Button
  return (
    <TouchableOpacity
      style={[styles.addBtnContainer, size === 'small' && styles.addBtnSmall, style]}
      onPress={handleAdd}
      activeOpacity={0.8}
    >
      <Text style={[styles.addBtnText, size === 'small' && styles.addTextSmall]}>
        ADD
      </Text>
      <View style={styles.plusTag}>
        <Text style={styles.plusTagText}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Default Broad Rectangular ADD Button (JioMart / Zepto Tier)
  addBtnContainer: {
    width: 76,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7A0C1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#7A0C1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 4,
  },
  addBtnSmall: {
    width: 68,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.2,
  },
  addBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#7A0C1F',
    letterSpacing: 0.6,
  },
  addTextSmall: {
    fontSize: 11,
  },
  plusTag: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#7A0C1F',
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    marginTop: -1,
  },

  // Active Quantity Stepper (- 1 +)
  stepperContainer: {
    width: 82,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#7A0C1F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 4,
  },
  stepperSmall: {
    width: 72,
    height: 28,
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  stepperBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  stepperQtyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  qtySmall: {
    fontSize: 12,
  },
});
