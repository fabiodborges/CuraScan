import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { useAuthContext } from '../../navigation/RootNavigator';
import { colors, fontSize, spacing } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function OnboardingScreen({ navigation }: Props) {
  const { enterDemo } = useAuthContext();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>WAITIX</Text>
          <Text style={styles.tagline}>Le temps perdu n'existe plus.</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Quelqu'un fait{'\n'}la queue{' '}
            <Text style={styles.heroAccent}>pour vous.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Trouvez un Waiter près de vous, il fait la queue à votre place.
            Vous payez, il attend. Simple.
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>80%</Text>
            <Text style={styles.statLabel}>pour le Waiter</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8€</Text>
            <Text style={styles.statLabel}>à partir de</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>30min</Text>
            <Text style={styles.statLabel}>minimum</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Commencer"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title="J'ai déjà un compte"
          variant="ghost"
          onPress={() => navigation.navigate('SignIn')}
        />
        <Button
          title="Explorer en mode demo"
          variant="secondary"
          size="md"
          onPress={enterDemo}
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
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  hero: {
    marginBottom: spacing.xxl,
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accent,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
});
