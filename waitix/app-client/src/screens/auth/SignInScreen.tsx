import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthContext } from '../../navigation/RootNavigator';
import { colors, fontSize, spacing } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function SignInScreen({ navigation }: Props) {
  const { signIn, isLoading, enterDemo } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Mot de passe requis';
    else if (password.length < 6) newErrors.password = '6 caractères minimum';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    try {
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de se connecter');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Heureux de vous revoir sur WAITIX
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
            <Input
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <Button
              title="Se connecter"
              onPress={handleSignIn}
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              title="Continuer avec Apple"
              variant="secondary"
              onPress={() => Alert.alert('Apple Sign-In', 'Bientôt disponible')}
            />
            <Button
              title="Continuer avec Google"
              variant="secondary"
              onPress={() => Alert.alert('Google Sign-In', 'Bientôt disponible')}
            />
          </View>

          <Button
            title="Explorer en mode demo"
            variant="ghost"
            size="md"
            onPress={enterDemo}
            style={{ marginBottom: spacing.lg }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    marginBottom: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    fontSize: fontSize.sm,
  },
  socialButtons: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  footerLink: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
