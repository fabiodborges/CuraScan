import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type MissionLiveParams = {
  location: string;
  duration: number;
  price: number;
  waiterName: string;
  waiterRating: number;
  waiterMissions: number;
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ MissionLive: MissionLiveParams }, 'MissionLive'>;
};

export function MissionLiveScreen({ navigation, route }: Props) {
  const { location, duration, price, waiterName, waiterRating, waiterMissions } =
    route.params;

  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [queuePosition, setQueuePosition] = useState(12);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  const remainingMinutes = Math.max(duration - elapsedMinutes, 0);
  const progressPercent = Math.min((elapsedMinutes / duration) * 100, 100);

  // Simulate time passing (1 real second = 1 minute in demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  // Simulate queue position decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      setQueuePosition((prev) => Math.max(prev - 1, 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent / 100,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progressPercent, progressAnim]);

  // Pulsing dot animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [dotAnim]);

  const formatTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
    return `${m} min`;
  };

  const isCompleted = elapsedMinutes >= duration;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mission en cours</Text>
          <Animated.View style={[styles.liveDot, { opacity: dotAnim }]} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        {/* Waiter Info */}
        <View style={styles.waiterCard}>
          <View style={styles.waiterAvatar}>
            <Text style={styles.waiterAvatarText}>
              {waiterName.charAt(0)}
            </Text>
          </View>
          <View style={styles.waiterInfo}>
            <Text style={styles.waiterName}>{waiterName}</Text>
            <Text style={styles.waiterStats}>
              ⭐ {waiterRating} · {waiterMissions} missions
            </Text>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Queue Position */}
        <View style={styles.queueCard}>
          <Text style={styles.queueLabel}>Position dans la file</Text>
          <View style={styles.queuePositionRow}>
            <Text style={styles.queueNumber}>{queuePosition}</Text>
            <Text style={styles.queueSuffix}>
              {queuePosition === 1 ? 'er' : 'eme'}
            </Text>
          </View>
          <View style={styles.queueDots}>
            {Array.from({ length: Math.min(queuePosition, 15) }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.queueDotItem,
                  i === 0 && styles.queueDotItemActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progression</Text>
            <Text style={styles.progressPercent}>
              {Math.round(progressPercent)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Time Stats */}
        <View style={styles.timeRow}>
          <View style={styles.timeCard}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeValue}>{formatTime(elapsedMinutes)}</Text>
            <Text style={styles.timeLabel}>Ecoule</Text>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeIcon}>⏳</Text>
            <Text style={styles.timeValue}>
              {formatTime(remainingMinutes)}
            </Text>
            <Text style={styles.timeLabel}>Restant</Text>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeIcon}>💶</Text>
            <Text style={styles.timeValue}>{price}€</Text>
            <Text style={styles.timeLabel}>Total</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationBar}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* CTA */}
        {isCompleted ? (
          <View style={styles.completedSection}>
            <Text style={styles.completedTitle}>Mission terminee !</Text>
            <Button
              title="Noter votre Waiter"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        ) : (
          <Button
            title="J'arrive — Terminer la mission"
            variant="outline"
            onPress={() => setElapsedMinutes(duration)}
          />
        )}
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
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  liveText: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.success,
    letterSpacing: 1,
  },
  waiterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  waiterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  waiterAvatarText: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.background,
  },
  waiterInfo: {
    flex: 1,
  },
  waiterName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  waiterStats: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackgroundHover,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 20,
  },
  queueCard: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  queueLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  queuePositionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  queueNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.accent,
    lineHeight: 60,
  },
  queueSuffix: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  queueDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  queueDotItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  queueDotItemActive: {
    backgroundColor: colors.accent,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: fontSize.md,
    fontWeight: '900',
    color: colors.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  timeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: fontSize.md,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  timeLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  completedSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  completedTitle: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accent,
  },
});
