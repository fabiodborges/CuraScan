import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function OnboardingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>WAITIX</Text>
          <Text style={styles.badge}>WAITER</Text>
          <Text style={styles.tagline}>Gagnez de l'argent en faisant la queue.</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Faites la queue.{'\n'}
            <Text style={styles.heroAccent}>Gagnez 80%.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Des clients cherchent quelqu'un pour faire la queue à leur place.
            Acceptez des missions, gagnez de l'argent, travaillez quand vous voulez.
          </Text>
        </View>

        <View style={styles.earnings}>
          <Text style={styles.earningsTitle}>Exemples de gains</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>6,40€</Text>
              <Text style={styles.earningDuration}>30 min</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>12€</Text>
              <Text style={styles.earningDuration}>1 heure</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>22,40€</Text>
              <Text style={styles.earningDuration}>2 heures</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>42,40€</Text>
              <Text style={styles.earningDuration}>4 heures</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Devenir Waiter"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title="J'ai déjà un compte"
          variant="ghost"
          onPress={() => navigation.navigate('SignIn')}
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
    fontSize: 48,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 4,
  },
  badge: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.background,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: spacing.xs,
    overflow: 'hidden',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  hero: {
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 44,
  },
  heroAccent: {
    color: colors.accent,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 24,
  },
  earnings: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  earningsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningItem: {
    alignItems: 'center',
  },
  earningAmount: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.accent,
  },
  earningDuration: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
});
