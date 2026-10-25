// src/app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../components/animated-screen';
import { MOCK_USERS } from '../constants/mockUsers';
import { Colors } from '../constants/theme';
import { styles } from '../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();

  // State untuk form & validasi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fungsi penanganan login
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email/Username dan kata sandi wajib diisi!');
      return;
    }

    const input = email.trim().toLowerCase();
    const userFound = MOCK_USERS.find(
      (user) =>
        (user.email.toLowerCase() === input || user.name.toLowerCase() === input) &&
        user.password === password
    );

    if (userFound) {
      setErrorMsg('');
      // Jangan taruh navigasi di dalam callback Alert: di react-native-web
      // Alert.alert() no-op, jadi tombol "Masuk" tidak pernah lanjut.
      router.replace('/home' as any);
    } else {
      setErrorMsg('Email/Username atau kata sandi salah!');
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
                placeholder="doa.wahyudi@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
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
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMsg('');
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tombol Sign In */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Masuk</Text>
            </TouchableOpacity>

            {/* Lupa Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/changepassword' as any)}
            >
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