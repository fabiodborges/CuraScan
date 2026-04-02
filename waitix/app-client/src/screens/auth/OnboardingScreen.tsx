import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthContext } from '../../navigation/RootNavigator';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function OnboardingScreen({ navigation }: Props) {
  const { enterDemo } = useAuthContext();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [proofIndex, setProofIndex] = useState(0);

  const socialProofs = [
    '⚡ 3 personnes reservent autour de toi',
    '🔥 Waiter dispo en 5 min',
    '📍 2 waiters disponibles autour de toi',
  ];

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // CTA pulse
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Rotate social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setProofIndex((prev) => (prev + 1) % socialProofs.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [socialProofs.length]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>WAITIX</Text>
        </View>

        {/* Headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>
            Gagne 1h.{'\n'}
            <Text style={styles.headlineAccent}>
              On fait la queue pour toi.
            </Text>
          </Text>
        </View>

        {/* Social Proof - Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ 4.8</Text>
          <View style={styles.ratingDot} />
          <Text style={styles.ratingCount}>1 200+ missions</Text>
        </View>

        {/* Dynamic Social Proof */}
        <View style={styles.dynamicProof}>
          <Text style={styles.dynamicProofText}>
            {socialProofs[proofIndex]}
          </Text>
        </View>
      </Animated.View>

      {/* Sticky Bottom CTA */}
      <View style={styles.stickyBottom}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={enterDemo}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Eviter la queue maintenant</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Trust Line */}
        <Text style={styles.trustLine}>
          🔒 Paiement securise • Debit uniquement si mission reussie
        </Text>

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.ghostButtonText}>Creer un compte</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkText}>J'ai deja un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 6,
  },
  headlineSection: {
    marginBottom: spacing.xl,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 42,
    textAlign: 'center',
  },
  headlineAccent: {
    color: colors.accent,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  ratingText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ratingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  ratingCount: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  dynamicProof: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
  },
  dynamicProofText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stickyBottom: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.background,
    letterSpacing: 0.3,
  },
  trustLine: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  ghostButton: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  ghostButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  linkText: {
    fontSize: fontSize.sm,
    color: colors.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
