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
    else if (password.length < 8) newErrors.password = '8 caractères minimum';
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
        'Un lien de confirmation a été envoyé à votre adresse email. Après vérification, vous pourrez compléter votre profil Waiter (KYC + IBAN).',
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
            <Text style={styles.title}>Devenir Waiter</Text>
            <Text style={styles.subtitle}>
              Gagnez 80% sur chaque mission
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Comment ça marche ?</Text>
            <Text style={styles.infoStep}>1. Créez votre compte</Text>
            <Text style={styles.infoStep}>2. Vérifiez votre identité (KYC)</Text>
            <Text style={styles.infoStep}>3. Ajoutez votre IBAN</Text>
            <Text style={styles.infoStep}>4. Acceptez des missions et gagnez de l'argent</Text>
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
              placeholder="8 caractères minimum"
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
              title="Créer mon compte Waiter"
              onPress={handleSignUp}
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>

          <Text style={styles.terms}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions Générales</Text>, notre{' '}
            <Text style={styles.termsLink}>Politique de Confidentialité</Text> et les{' '}
            <Text style={styles.termsLink}>Règles du Waiter</Text>.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà Waiter ? </Text>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.accent,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoStep: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  form: {
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.sm,
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
