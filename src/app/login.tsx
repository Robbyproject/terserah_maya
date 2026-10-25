// src/app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedScreen } from '../components/animated-screen';
import { Colors } from '../constants/theme';
import { loginUser } from '../services/user.service';
import { styles } from '../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email/Username dan kata sandi wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Panggil backend API Express dengan JWT
      const user = await loginUser(email.trim(), password);

      Alert.alert('Berhasil Masuk', `Selamat datang kembali, ${user.name}!`, [
        {
          text: 'Lanjut',
          onPress: () => {
            router.replace('/home');
          },
        },
      ]);
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal masuk. Periksa kembali akun Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        {/* Header Biru Atas */}
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

        {/* Form Card Putih Rounded */}
        <View style={styles.formCard}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Pesan Error */}
            {errorMsg ? (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 13, textAlign: 'center' }}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Email / Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email / Username</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@email.com atau username"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={email}
                editable={!loading}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg('');
                }}
              />
            </View>

            {/* Password */}
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
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

            {/* Lupa Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/changepassword')}>
              <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
            </TouchableOpacity>

            {/* Pembatas Or */}
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

            {/* Footer Navigasi Ke Register */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signUpText}>Daftar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}