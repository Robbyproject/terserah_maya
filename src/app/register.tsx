// src/app/register.tsx
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
import { registerUser } from '../services/user.service';
import { styles } from '../styles/register.styles';

export default function RegisterScreen() {
  const router = useRouter();

  // State Form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    // 1. Validasi Kolom Kosong
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi!');
      return;
    }

    // 2. Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Masukkan alamat email yang valid!');
      return;
    }

    // 3. Validasi Panjang Sandi
    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter!');
      return;
    }

    // 4. Validasi Kecocokan Konfirmasi Sandi
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    // 5. Validasi Syarat & Ketentuan
    if (!agreed) {
      setErrorMsg('Anda harus menyetujui Syarat & Ketentuan!');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Panggil backend API Express dengan JWT
      const user = await registerUser(username.trim(), email.trim().toLowerCase(), password);

      Alert.alert('Pendaftaran Berhasil', `Selamat datang, ${user.name}! Akunmu siap digunakan.`, [
        {
          text: 'Mulai',
          onPress: () => {
            router.replace('/home');
          },
        },
      ]);
    } catch (error: any) {
      setErrorMsg(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        {/* Header Biru Atas */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBackground}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={30} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Buat Akun</Text>
            <Text style={styles.headerSubtitle}>Daftar untuk memulai layanan kami</Text>
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

            {/* Nama / Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nama Lengkap / Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Robby Permana"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                value={username}
                editable={!loading}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrorMsg('');
                }}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                editable={!loading}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg('');
                }}
              />
              <Text style={styles.warningText}>ⓘ Gunakan alamat email aktif Anda</Text>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <TextInput
                  style={[styles.input, { paddingRight: 45 }]}
                  placeholder="Minimal 6 karakter"
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
                  style={{ position: 'absolute', right: 12, height: 40, justifyContent: 'center' }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
              <View style={{ position: 'relative', justifyContent: 'center' }}>
                <TextInput
                  style={[styles.input, { paddingRight: 45 }]}
                  placeholder="Ulangi kata sandi"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  editable={!loading}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrorMsg('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: 12, height: 40, justifyContent: 'center' }}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkbox Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setAgreed(!agreed);
                setErrorMsg('');
              }}
              activeOpacity={0.8}>
              <Ionicons
                name={agreed ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={agreed ? Colors.primary : Colors.textSecondary}
              />
              <Text style={styles.termsText}>
                Saya menyetujui <Text style={styles.linkText}>Syarat & Ketentuan</Text> serta{' '}
                <Text style={styles.linkText}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>

            {/* Tombol Register */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Buat Akun</Text>
              )}
            </TouchableOpacity>

            {/* Footer Link ke Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.signUpText}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}