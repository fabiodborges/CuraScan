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
import { useAuth } from '../../hooks/useAuth';
import { colors, fontSize, spacing } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function SignUpScreen({ navigation }: Props) {
  const { signUp, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Nom complet requis';
    if (!email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Mot de passe requis';
    else if (password.length < 6) newErrors.password = '6 caractères minimum';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    try {
      await signUp(email.trim(), password, fullName.trim());
      Alert.alert(
        'Vérifiez votre email',
        'Un lien de confirmation a été envoyé à votre adresse email.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Impossible de créer le compte");
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
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>
              Créez votre compte Client WAITIX
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nom complet"
              placeholder="Jean Dupont"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              error={errors.fullName}
            />
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
              placeholder="6 caractères minimum"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />
            <Input
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={errors.confirmPassword}
            />

            <Button
              title="Créer mon compte"
              onPress={handleSignUp}
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

          <Text style={styles.terms}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions Générales</Text> et notre{' '}
            <Text style={styles.termsLink}>Politique de Confidentialité</Text>.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.footerLink}>Se connecter</Text>
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
    marginBottom: spacing.lg,
  },
  terms: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.accent,
    fontWeight: '600',
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
