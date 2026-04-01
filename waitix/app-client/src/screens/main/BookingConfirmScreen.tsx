import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type BookingParams = {
  location: string;
  duration: number;
  price: number;
  basePrice: number;
  isUrgent: boolean;
  urgentSupplement: number;
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ BookingConfirm: BookingParams }, 'BookingConfirm'>;
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}

export function BookingConfirmScreen({ navigation, route }: Props) {
  const { location, duration, price, basePrice, isUrgent, urgentSupplement } =
    route.params;

  const handleConfirm = () => {
    navigation.navigate('Matching', {
      location,
      duration,
      price,
      isUrgent,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Recapitulatif</Text>

        {/* Mission Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>📍</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Lieu</Text>
              <Text style={styles.cardValue}>{location}</Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>⏱️</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Duree estimee</Text>
              <Text style={styles.cardValue}>{formatDuration(duration)}</Text>
            </View>
          </View>
          {isUrgent && (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.cardRow}>
                <Text style={styles.cardIcon}>⚡</Text>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardLabel, { color: colors.warning }]}>
                    Mode Urgent
                  </Text>
                  <Text style={styles.cardValue}>
                    Waiter en moins de 30 min
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Time Saved */}
        <View style={styles.timeSavedCard}>
          <Text style={styles.timeSavedIcon}>🎉</Text>
          <View>
            <Text style={styles.timeSavedTitle}>
              Vous gagnez {formatDuration(duration)}
            </Text>
            <Text style={styles.timeSavedSubtitle}>
              de temps libre pendant que votre Waiter attend
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Detail du prix</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              File d'attente ({formatDuration(duration)})
            </Text>
            <Text style={styles.priceValue}>{basePrice}€</Text>
          </View>
          {isUrgent && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Supplement urgent</Text>
              <Text style={[styles.priceValue, { color: colors.warning }]}>
                +{urgentSupplement}€
              </Text>
            </View>
          )}
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>{price}€</Text>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustSection}>
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustTitle}>Paiement securise</Text>
            <Text style={styles.trustDesc}>
              Vos donnees bancaires sont protegees par Stripe
            </Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>🛡️</Text>
            <Text style={styles.trustTitle}>Debit conditionnel</Text>
            <Text style={styles.trustDesc}>
              Vous n'etes debite que si la mission est completee
            </Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>⭐</Text>
            <Text style={styles.trustTitle}>Waiters verifies</Text>
            <Text style={styles.trustDesc}>
              Identite verifiee, notes et avis visibles
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Button
          title={`Confirmer — ${price}€`}
          onPress={handleConfirm}
          style={styles.confirmButton}
        />

        <Text style={styles.legalNote}>
          Une empreinte bancaire sera effectuee. Le debit n'aura lieu qu'a la
          fin de la mission.
        </Text>
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
  back: {
    paddingVertical: spacing.md,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  timeSavedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(212, 255, 0, 0.06)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.15)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  timeSavedIcon: {
    fontSize: 32,
  },
  timeSavedTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.accent,
  },
  timeSavedSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  priceTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  priceLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  priceTotalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  priceTotalValue: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accent,
  },
  trustSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.sm,
    padding: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    flexWrap: 'wrap',
  },
  trustIcon: {
    fontSize: 18,
  },
  trustTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trustDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    width: '100%',
    marginLeft: 30,
    marginTop: -2,
  },
  confirmButton: {
    marginBottom: spacing.sm,
  },
  legalNote: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
