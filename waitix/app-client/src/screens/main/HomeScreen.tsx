import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors, fontSize, spacing } from '../../theme';

export function HomeScreen() {
  const { profile, signOut, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>WAITIX</Text>
          <Text style={styles.greeting}>
            Bonjour, {profile?.full_name || 'Client'}
          </Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🎯</Text>
          <Text style={styles.placeholderTitle}>
            Trouvez un Waiter
          </Text>
          <Text style={styles.placeholderText}>
            Les fonctionnalités de réservation, carte GPS et chat arrivent dans le Sprint 2.
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
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 3,
  },
  greeting: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    fontWeight: '600',
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
