import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
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
              Trouvez un Waiter pres de vous, il fait la queue a votre place.
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
              <Text style={styles.statLabel}>a partir de</Text>
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
            title="Explorer l'app"
            onPress={enterDemo}
          />
          <Button
            title="Creer un compte"
            variant="outline"
            onPress={() => navigation.navigate('SignUp')}
          />
          <Button
            title="J'ai deja un compte"
            variant="ghost"
            size="md"
            onPress={() => navigation.navigate('SignIn')}
          />
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
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  hero: {
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  heroAccent: {
    color: colors.accent,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
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
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
});
