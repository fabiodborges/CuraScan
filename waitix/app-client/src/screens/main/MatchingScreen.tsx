import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type MatchingParams = {
  location: string;
  duration: number;
  price: number;
  isUrgent: boolean;
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ Matching: MatchingParams }, 'Matching'>;
};

type MatchingState = 'searching' | 'fallback' | 'found';

export function MatchingScreen({ navigation, route }: Props) {
  const { location, duration, price, isUrgent } = route.params;
  const [state, setState] = useState<MatchingState>('searching');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for the radar
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Rotate animation
  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fallback after 60 seconds
  useEffect(() => {
    if (secondsElapsed >= 60 && state === 'searching') {
      setState('fallback');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [secondsElapsed, state, fadeAnim]);

  // Simulate waiter found (demo: after 8s in searching, or 15s after fallback)
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setState('found');
        setTimeout(() => {
          navigation.replace('MissionLive', {
            location,
            duration,
            price,
            waiterName: 'Karim D.',
            waiterRating: 4.8,
            waiterMissions: 47,
          });
        }, 2000);
      },
      state === 'fallback' ? 15000 : 8000
    );
    return () => clearTimeout(timeout);
  }, [state, navigation, location, duration, price]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressPercent = Math.min((secondsElapsed / 60) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        {/* Radar Animation */}
        <View style={styles.radarContainer}>
          <Animated.View
            style={[
              styles.radarRing3,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={styles.radarRing2} />
          <View style={styles.radarRing1} />
          <Animated.View
            style={[styles.radarSweep, { transform: [{ rotate: spin }] }]}
          >
            <View style={styles.radarLine} />
          </Animated.View>
          <View style={styles.radarCenter}>
            <Text style={styles.radarIcon}>
              {state === 'found' ? '✓' : '📡'}
            </Text>
          </View>
        </View>

        {/* Status Text */}
        {state === 'searching' && (
          <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>Recherche en cours...</Text>
            <Text style={styles.statusSubtitle}>
              On cherche le meilleur Waiter pres de {location}
            </Text>
            {isUrgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>⚡ Priorite urgente</Text>
              </View>
            )}
            <Text style={styles.timer}>{secondsElapsed}s</Text>

            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>
        )}

        {state === 'fallback' && (
          <Animated.View style={[styles.statusSection, { opacity: fadeAnim }]}>
            <Text style={styles.statusTitle}>
              On s'en occupe pour vous
            </Text>
            <Text style={styles.statusSubtitle}>
              Pas de Waiter disponible immediatement.{'\n'}
              Notre equipe recherche manuellement{'\n'}
              quelqu'un pour votre mission.
            </Text>
            <View style={styles.fallbackCard}>
              <Text style={styles.fallbackIcon}>🔔</Text>
              <Text style={styles.fallbackText}>
                Vous serez notifie des qu'un Waiter accepte.
                Vous pouvez fermer l'app en attendant.
              </Text>
            </View>
            <Text style={styles.fallbackReassurance}>
              Aucun debit ne sera effectue tant qu'un Waiter n'a pas accepte
            </Text>
          </Animated.View>
        )}

        {state === 'found' && (
          <View style={styles.statusSection}>
            <Text style={styles.foundTitle}>Waiter trouve !</Text>
            <Text style={styles.foundSubtitle}>
              Connexion en cours...
            </Text>
          </View>
        )}

        {/* Mission Recap */}
        <View style={styles.missionRecap}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>📍 {location}</Text>
            <Text style={styles.recapValue}>{price}€</Text>
          </View>
        </View>

        {/* Cancel */}
        {state !== 'found' && (
          <Button
            title="Annuler la recherche"
            variant="ghost"
            size="md"
            onPress={() => navigation.goBack()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const RADAR_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  radarContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  radarRing3: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.08)',
  },
  radarRing2: {
    position: 'absolute',
    width: RADAR_SIZE * 0.7,
    height: RADAR_SIZE * 0.7,
    borderRadius: (RADAR_SIZE * 0.7) / 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.15)',
  },
  radarRing1: {
    position: 'absolute',
    width: RADAR_SIZE * 0.4,
    height: RADAR_SIZE * 0.4,
    borderRadius: (RADAR_SIZE * 0.4) / 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.25)',
  },
  radarSweep: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
  },
  radarLine: {
    width: 2,
    height: RADAR_SIZE / 2,
    backgroundColor: colors.accent,
    opacity: 0.4,
  },
  radarCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 255, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  radarIcon: {
    fontSize: 24,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  statusSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  urgentBadge: {
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  urgentBadgeText: {
    color: colors.warning,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  timer: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accent,
    marginBottom: spacing.md,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  fallbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  fallbackIcon: {
    fontSize: 24,
  },
  fallbackText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  fallbackReassurance: {
    fontSize: fontSize.xs,
    color: colors.success,
    textAlign: 'center',
  },
  foundTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  foundSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  missionRecap: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recapLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  recapValue: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.accent,
  },
});
