// File: src/app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedScreen } from '../components/animated-screen';
import { Colors } from '../constants/theme';
import { ApiError, loginUser, resendOtp } from '../services/user.service';
import { styles } from '../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingVerify, setResendingVerify] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Email/Username dan kata sandi wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setUnverifiedEmail(null);

      await loginUser(email.trim(), password);
      router.replace('/home' as any);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Email atau kata sandi salah!');
      if (
        (error instanceof ApiError && error.code === 'EMAIL_NOT_VERIFIED') ||
        error?.code === 'EMAIL_NOT_VERIFIED' ||
        error?.status === 403
      ) {
        setUnverifiedEmail(email.trim());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToVerifyOtp = async () => {
    const targetEmail = unverifiedEmail || email.trim();
    if (!targetEmail) return;

    try {
      setResendingVerify(true);
      await resendOtp(targetEmail, 'register').catch(() => {
        // Jika masih dalam cooldown 60 detik, tetap arahkan ke layar OTP
      });
      router.push({
        pathname: '/verify-otp' as any,
        params: {
          email: targetEmail,
          purpose: 'register',
        },
      });
    } finally {
      setResendingVerify(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBackground}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="grid" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Terserah App</Text>
            <Text style={styles.headerSubtitle}>Masuk ke akun Anda</Text>
          </View>
        </SafeAreaView>

        <View style={styles.formCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            {/* Email / Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email / Username</Text>
              <TextInput
                style={styles.input}
                placeholder="doa@gmail.com atau doawahyudi"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                editable={!loading}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg('');
                  setUnverifiedEmail(null);
                }}
              />
            </View>

            {/* Kata Sandi */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  editable={!loading}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMsg('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tombol Masuk */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Masuk</Text>
              )}
            </TouchableOpacity>

            {/* Pesan Error & Tombol Kirim Ulang Verifikasi (jika 403 EMAIL_NOT_VERIFIED) */}
            {errorMsg ? (
              <View
                style={{
                  backgroundColor: '#FEE2E2',
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 12,
                  gap: 8,
                }}>
                <Text style={{ color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
                  {errorMsg}
                </Text>
                {unverifiedEmail ? (
                  <TouchableOpacity
                    onPress={handleGoToVerifyOtp}
                    disabled={resendingVerify}
                    style={{
                      backgroundColor: Colors.primary,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}>
                    {resendingVerify ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                        Kirim Ulang Kode & Verifikasi Email
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            {/* Lupa Kata Sandi */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/changepassword' as any)}>
              <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
            </TouchableOpacity>

            {/* Pembatas ATAU */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ATAU</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login */}
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
              <Text style={styles.socialText}>Lanjutkan dengan Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={18} color="#1877F2" style={{ marginRight: 8 }} />
              <Text style={styles.socialText}>Lanjutkan dengan Facebook</Text>
            </TouchableOpacity>

            {/* Footer Navigasi ke Register */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/register' as any)}>
                <Text style={styles.signUpText}>Daftar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}