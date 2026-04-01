import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors, fontSize, spacing } from '../../theme';

export function DashboardScreen() {
  const { profile, signOut, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>WAITIX</Text>
          <Text style={styles.badge}>WAITER</Text>
          <Text style={styles.greeting}>
            Bonjour, {profile?.full_name || 'Waiter'}
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Vos gains</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0€</Text>
              <Text style={styles.statLabel}>Aujourd'hui</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0€</Text>
              <Text style={styles.statLabel}>Cette semaine</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0€</Text>
              <Text style={styles.statLabel}>Ce mois</Text>
            </View>
          </View>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📍</Text>
          <Text style={styles.placeholderTitle}>
            Missions à proximité
          </Text>
          <Text style={styles.placeholderText}>
            Le radar de missions, le GPS et le chat arrivent dans le Sprint 3.
          </Text>
        </View>

        <Button
          title="Se déconnecter"
          variant="outline"
          onPress={signOut}
          loading={isLoading}
        />
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 3,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
    letterSpacing: 2,
  },
  greeting: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accent,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  placeholderTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
