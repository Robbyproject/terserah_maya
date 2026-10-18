// src/app/changepassword.tsx
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
import { styles } from '../styles/change.styles';
import { AnimatedScreen } from '../components/animated-screen';

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              <Ionicons name="key-outline" size={30} color="#0284C7" />
            </View>
            <Text style={styles.headerTitle}>Ubah Kata Sandi</Text>
            <Text style={styles.headerSubtitle}>
              Buat kata sandi baru untuk mengamankan akun Anda
            </Text>
          </View>
        </SafeAreaView>

        {/* Form Card Putih Rounded */}
        <View style={styles.formCard}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Kata Sandi Saat Ini / Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi Saat Ini</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Kata Sandi Baru */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi Baru</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.infoText}>
                Minimal 8 karakter, gabungan huruf besar, kecil, dan angka.
              </Text>
            </View>

            {/* Konfirmasi Kata Sandi Baru */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tombol Simpan */}
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Simpan Kata Sandi</Text>
            </TouchableOpacity>

            {/* Footer Link ke Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Batal? </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={styles.linkText}>Kembali ke Masuk</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}