import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { useAuthContext } from '../../navigation/RootNavigator';
import { colors, fontSize, spacing, borderRadius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function ProfileScreen({ navigation }: Props) {
  const { profile, signOut, isLoading } = useAuthContext();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.full_name?.charAt(0).toUpperCase() || 'C'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.full_name || 'Client'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.menuSection}>
          {[
            { icon: '📋', label: 'Historique des missions' },
            { icon: '💳', label: 'Methodes de paiement' },
            { icon: '🔔', label: 'Notifications' },
            { icon: '❓', label: 'FAQ' },
            { icon: '🛡️', label: 'Regles & Securite' },
            { icon: '📄', label: 'CGU / Confidentialite' },
            { icon: '💬', label: 'Support / Contact' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Se deconnecter"
          variant="outline"
          onPress={signOut}
          loading={isLoading}
          style={styles.logoutButton}
        />

        <Text style={styles.version}>WAITIX v1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.background,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  menuArrow: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  logoutButton: {
    marginBottom: spacing.md,
  },
  version: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
