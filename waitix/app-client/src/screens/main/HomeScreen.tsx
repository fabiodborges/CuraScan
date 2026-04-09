import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthContext } from '../../navigation/RootNavigator';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import { PRICING } from '../../types';

const DURATION_OPTIONS = [
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1h' },
  { minutes: 90, label: '1h30' },
  { minutes: 120, label: '2h' },
  { minutes: 150, label: '2h30' },
  { minutes: 180, label: '3h' },
  { minutes: 210, label: '3h30' },
  { minutes: 240, label: '4h' },
];

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function HomeScreen({ navigation }: Props) {
  const { profile } = useAuthContext();
  const [location, setLocation] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [isUrgent, setIsUrgent] = useState(false);

  const pricing = PRICING.find((p) => p.duration_minutes === selectedDuration);
  const basePrice = pricing?.price_client ?? 0;
  const urgentSupplement = isUrgent ? 5 : 0;
  const totalPrice = basePrice + urgentSupplement;

  const canBook = location.trim().length > 2;

  const handleBook = () => {
    navigation.navigate('BookingConfirm', {
      location: location.trim(),
      duration: selectedDuration,
      price: totalPrice,
      basePrice,
      isUrgent,
      urgentSupplement,
    });
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarText}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Quelqu'un fait la queue{'\n'}
            <Text style={styles.heroAccent}>pour vous.</Text>
          </Text>
        </View>

        {/* Location Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Ou faites-vous la queue ?</Text>
          <View style={styles.locationInput}>
            <Text style={styles.locationIcon}>📍</Text>
            <TextInput
              style={styles.locationTextInput}
              placeholder="Restaurant, concert, prefectures..."
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
              autoCapitalize="sentences"
            />
          </View>
        </View>

        {/* Duration Selector */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Combien de temps ?</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = selectedDuration === opt.minutes;
              const optPricing = PRICING.find(
                (p) => p.duration_minutes === opt.minutes
              );
              return (
                <TouchableOpacity
                  key={opt.minutes}
                  style={[
                    styles.durationChip,
                    isSelected && styles.durationChipSelected,
                  ]}
                  onPress={() => setSelectedDuration(opt.minutes)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.durationChipLabel,
                      isSelected && styles.durationChipLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.durationChipPrice,
                      isSelected && styles.durationChipPriceSelected,
                    ]}
                  >
                    {optPricing?.price_client}€
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Urgent Mode */}
        <TouchableOpacity
          style={[styles.urgentToggle, isUrgent && styles.urgentToggleActive]}
          onPress={() => setIsUrgent(!isUrgent)}
          activeOpacity={0.7}
        >
          <View style={styles.urgentLeft}>
            <Text style={styles.urgentIcon}>⚡</Text>
            <View>
              <Text
                style={[
                  styles.urgentTitle,
                  isUrgent && styles.urgentTitleActive,
                ]}
              >
                Mode Urgent
              </Text>
              <Text style={styles.urgentDesc}>
                Waiter en moins de 30 min
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.urgentPrice,
              isUrgent && styles.urgentPriceActive,
            ]}
          >
            +5€
          </Text>
        </TouchableOpacity>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              File d'attente ({DURATION_OPTIONS.find(o => o.minutes === selectedDuration)?.label})
            </Text>
            <Text style={styles.priceValue}>{basePrice}€</Text>
          </View>
          {isUrgent && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Supplement urgent</Text>
              <Text style={[styles.priceValue, { color: colors.warning }]}>
                +5€
              </Text>
            </View>
          )}
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotal}>Total</Text>
            <Text style={styles.priceTotalValue}>{totalPrice}€</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, !canBook && styles.ctaButtonDisabled]}
          onPress={handleBook}
          disabled={!canBook}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Trouver quelqu'un</Text>
          <Text style={styles.ctaPrice}>{totalPrice}€</Text>
        </TouchableOpacity>

        {/* Trust */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustText}>Paiement securise</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>✓</Text>
            <Text style={styles.trustText}>Debit si mission reussie</Text>
          </View>
        </View>
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
    alignItems: 'center',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackgroundHover,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  hero: {
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 38,
  },
  heroAccent: {
    color: colors.accent,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  locationTextInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    height: '100%',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  durationChip: {
    width: '23%',
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  durationChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  durationChipLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  durationChipLabelSelected: {
    color: colors.background,
  },
  durationChipPrice: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  durationChipPriceSelected: {
    color: 'rgba(0,0,0,0.6)',
  },
  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  urgentToggleActive: {
    borderColor: colors.warning,
    backgroundColor: 'rgba(255, 179, 0, 0.08)',
  },
  urgentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  urgentIcon: {
    fontSize: 24,
  },
  urgentTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  urgentTitleActive: {
    color: colors.warning,
  },
  urgentDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  urgentPrice: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.textSecondary,
  },
  urgentPriceActive: {
    color: colors.warning,
  },
  priceSummary: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
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
  priceTotal: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  priceTotalValue: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accent,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    height: 60,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  ctaButtonDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.background,
  },
  ctaPrice: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.background,
    opacity: 0.7,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustIcon: {
    fontSize: 14,
    color: colors.success,
  },
  trustText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
