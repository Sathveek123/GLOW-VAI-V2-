import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { useCartStore } from '../../store/useCartStore';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  toolCallPill?: string;
  routineCard?: {
    title: string;
    items: string[];
    price: number;
  };
}

export const AiDermatologistChatScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { addToCart } = useCartStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am Dr. GlowVAI AI, your clinical skincare consultant. Based on your recent diagnostic report (84/100 Optimal), how can I assist your skincare routine today?',
      toolCallPill: '🔬 Checked skin diagnostic profile',
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated ReAct Agent Response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'For your combination skin barrier, applying Niacinamide 10% in the morning followed by Hyaluronic Acid provides deep hydration without clogging pores.',
        toolCallPill: '🔬 Checked active ingredient safety',
        routineCard: {
          title: 'Clinically Recommended Barrier Duo',
          items: ['Minimalist Niacinamide 10%', 'Dot & Key Hyaluronic Sunscreen'],
          price: 899,
        },
      };
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  const handleRoutineCheckout = (price: number) => {
    addToCart('prod_niacinamide_10', 1);
    addToCart('prod_dot_key_sunscreen', 1);
    router.push('/(customer)/(tabs)/cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Dr. GlowVAI AI</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Clinical Consultant Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(customer)/(tabs)/profile' as any)} style={styles.backBtn}>
          <Ionicons name="help-circle-outline" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isUser ? styles.userWrapper : styles.aiWrapper,
                ]}
              >
                {!isUser && (
                  <View style={styles.aiHeaderLabelRow}>
                    <MaterialCommunityIcons name="doctor" size={14} color={Colors.onboarding.primary} />
                    <Text style={styles.aiLabelText}>GlowVAI AI</Text>
                  </View>
                )}

                {msg.toolCallPill && (
                  <View style={styles.toolPill}>
                    <Text style={styles.toolPillText}>{msg.toolCallPill}</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
                    {msg.text}
                  </Text>
                </View>

                {msg.routineCard && (
                  <View style={styles.routineCard}>
                    <Text style={styles.routineTitle}>{msg.routineCard.title}</Text>
                    {msg.routineCard.items.map((item, idx) => (
                      <Text key={idx} style={styles.routineItem}>• {item}</Text>
                    ))}
                    <TouchableOpacity
                      style={styles.checkoutRoutineBtn}
                      onPress={() => handleRoutineCheckout(msg.routineCard!.price)}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.checkoutRoutineText}>
                        Add Routine to Cart • ₹{msg.routineCard.price}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          {/* AI Typing Indicator Bubble */}
          {isTyping && (
            <View style={[styles.messageWrapper, styles.aiWrapper]}>
              <View style={styles.aiHeaderLabelRow}>
                <MaterialCommunityIcons name="doctor" size={14} color={Colors.onboarding.primary} />
                <Text style={styles.aiLabelText}>GlowVAI AI</Text>
              </View>
              <View style={[styles.bubble, styles.aiBubble, { paddingVertical: 10, paddingHorizontal: 16 }]}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.onboarding.primary }} />
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.onboarding.primary, opacity: 0.6 }} />
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.onboarding.primary, opacity: 0.3 }} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Input Field */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            placeholder="Ask Dr. GlowVAI about your skin..."
            placeholderTextColor={Colors.onboarding.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.85}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AiDermatologistChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.onboarding.border,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.headingLg,
    fontSize: 16,
    color: Colors.onboarding.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.status.success,
  },
  statusText: {
    fontSize: 11,
    color: Colors.onboarding.textSecondary,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  messageWrapper: {
    maxWidth: '82%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  aiHeaderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  aiLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onboarding.primary,
  },
  toolPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.status.infoBg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  toolPillText: {
    fontSize: 11,
    color: Colors.status.info,
    fontWeight: '600',
  },
  bubble: {
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    backgroundColor: Colors.onboarding.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.shop.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  bubbleText: {
    ...Typography.bodyMd,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: Colors.onboarding.textPrimary,
  },
  routineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    marginTop: 10,
    gap: 4,
  },
  routineTitle: {
    ...Typography.headingSm,
    color: Colors.onboarding.textPrimary,
    marginBottom: 4,
  },
  routineItem: {
    ...Typography.bodySm,
    color: Colors.onboarding.textSecondary,
  },
  checkoutRoutineBtn: {
    backgroundColor: Colors.shop.cartGreen,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutRoutineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.onboarding.border,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.onboarding.surfaceInput,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.onboarding.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.onboarding.textSecondary,
  },
});
