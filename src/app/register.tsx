// src/app/register.tsx
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
import { Colors } from '../constants/theme';
import { styles } from '../styles/register.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

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

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Vincze Nikolett"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Work Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="nathan.roberts@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.warningText}>
                ⓘ Gunakan alamat email Anda
              </Text>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
              />
            </View>

            {/* Checkbox Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={agreed ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={agreed ? Colors.primary : Colors.textSecondary}
              />
              <Text style={styles.termsText}>
                Saya menyetujui <Text style={styles.linkText}>Syarat & Ketentuan</Text> serta <Text style={styles.linkText}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>

            {/* Tombol Register */}
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Buat Akun</Text>
            </TouchableOpacity>

            {/* Footer Link ke Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={styles.signUpText}>Masuk</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </AnimatedScreen>
  );
}