import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Switch,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

const DAILY_GOAL = 50;

const MOTIVATIONAL_MESSAGES = [
  'Chaque mission compte !',
  'Les meilleurs Waiters gagnent +200€/semaine',
  'Votre prochaine mission est peut-etre a 2 min',
  'Top Waiter en vue !',
  'La regularite paie toujours',
];

export function DashboardScreen() {
  const { profile, signOut, isLoading } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [dailyEarnings] = useState(32.40);
  const [weeklyEarnings] = useState(187.60);
  const [monthlyEarnings] = useState(642.80);
  const [missionsToday] = useState(3);
  const [motivationIndex, setMotivationIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const goalProgress = Math.min((dailyEarnings / DAILY_GOAL) * 100, 100);
  const remaining = Math.max(DAILY_GOAL - dailyEarnings, 0);
  const firstName = profile?.full_name?.split(' ')[0] || 'Waiter';

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: goalProgress / 100,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [goalProgress, progressAnim]);

  // Pulse when online
  useEffect(() => {
    if (isOnline) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isOnline, pulseAnim]);

  // Rotate motivational messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour, {firstName}</Text>
            <Text style={styles.subtitle}>
              {isOnline ? 'Vous etes en ligne' : 'Vous etes hors ligne'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.logo}>WAITIX</Text>
          </View>
        </View>

        {/* Online Toggle */}
        <Animated.View
          style={[
            styles.onlineCard,
            isOnline && styles.onlineCardActive,
            { transform: [{ scale: isOnline ? pulseAnim : 1 }] },
          ]}
        >
          <View style={styles.onlineLeft}>
            <View
              style={[styles.statusDot, isOnline && styles.statusDotOnline]}
            />
            <View>
              <Text
                style={[
                  styles.onlineTitle,
                  isOnline && styles.onlineTitleActive,
                ]}
              >
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </Text>
              <Text style={styles.onlineDesc}>
                {isOnline
                  ? 'Vous recevez les missions'
                  : 'Activez pour recevoir des missions'}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={colors.white}
          />
        </Animated.View>

        {/* Daily Goal */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Objectif du jour</Text>
            <Text style={styles.goalAmount}>
              {dailyEarnings.toFixed(2)}€{' '}
              <Text style={styles.goalTotal}>/ {DAILY_GOAL}€</Text>
            </Text>
          </View>
          <View style={styles.goalProgressBar}>
            <Animated.View
              style={[
                styles.goalProgressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.goalRemaining}>
            {remaining > 0
              ? `Plus que ${remaining.toFixed(2)}€ pour atteindre votre objectif !`
              : 'Objectif atteint ! Bravo !'}
          </Text>
        </View>

        {/* Earnings Grid */}
        <View style={styles.earningsGrid}>
          <View style={styles.earningCard}>
            <Text style={styles.earningLabel}>Aujourd'hui</Text>
            <Text style={styles.earningValue}>
              {dailyEarnings.toFixed(2)}€
            </Text>
            <Text style={styles.earningMissions}>{missionsToday} missions</Text>
          </View>
          <View style={styles.earningCard}>
            <Text style={styles.earningLabel}>Cette semaine</Text>
            <Text style={styles.earningValue}>
              {weeklyEarnings.toFixed(2)}€
            </Text>
            <Text style={styles.earningMissions}>14 missions</Text>
          </View>
          <View style={[styles.earningCard, styles.earningCardFull]}>
            <Text style={styles.earningLabel}>Ce mois</Text>
            <Text style={styles.earningValueLarge}>
              {monthlyEarnings.toFixed(2)}€
            </Text>
            <Text style={styles.earningMissions}>52 missions</Text>
          </View>
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationIcon}>💪</Text>
          <Text style={styles.motivationText}>
            {MOTIVATIONAL_MESSAGES[motivationIndex]}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeValue}>⭐ 4.8</Text>
            <Text style={styles.statBadgeLabel}>Note moyenne</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeValue}>98%</Text>
            <Text style={styles.statBadgeLabel}>Fiabilite</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeValue}>47</Text>
            <Text style={styles.statBadgeLabel}>Missions</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>💶</Text>
            <Text style={styles.actionLabel}>Retirer mes gains</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>Historique</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionLabel}>Mon profil</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Se deconnecter"
          variant="ghost"
          size="md"
          onPress={signOut}
          loading={isLoading}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 2,
  },
  onlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  onlineCardActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(212, 255, 0, 0.04)',
  },
  onlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.offline,
  },
  statusDotOnline: {
    backgroundColor: colors.online,
  },
  onlineTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  onlineTitleActive: {
    color: colors.accent,
  },
  onlineDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  goalAmount: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.accent,
  },
  goalTotal: {
    fontSize: fontSize.sm,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  goalProgressBar: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 5,
  },
  goalRemaining: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  earningCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  earningCardFull: {
    minWidth: '100%',
    backgroundColor: 'rgba(212, 255, 0, 0.04)',
    borderColor: 'rgba(212, 255, 0, 0.15)',
  },
  earningLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  earningValue: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  earningValueLarge: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accent,
  },
  earningMissions: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 255, 0, 0.06)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.12)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  motivationIcon: {
    fontSize: 24,
  },
  motivationText: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.accent,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBadge: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  statBadgeValue: {
    fontSize: fontSize.md,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statBadgeLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  actionArrow: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  logoutButton: {
    marginBottom: spacing.md,
  },
});
