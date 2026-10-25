// File: src/app/verify-otp.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedScreen } from '../components/animated-screen';
import { Colors } from '../constants/theme';
import { resendOtp, verifyOtp, type OtpPurpose } from '../services/user.service';
import { styles } from '../styles/verify-otp.styles';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string;
    purpose?: OtpPurpose;
    infoMessage?: string;
  }>();

  const email = (params.email ?? '').trim();
  const purpose: OtpPurpose = params.purpose === 'reset' ? 'reset' : 'register';

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(RESEND_COOLDOWN_SECONDS);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [infoMsg, setInfoMsg] = useState<string>(
    params.infoMessage ||
      'Kode verifikasi dikirim ke email-mu. Cek kotak masuk atau folder spam.'
  );

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer 60s untuk kirim ulang OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle per digit input + support auto-advance & paste
  const handleDigitChange = (text: string, index: number) => {
    setErrorMsg('');
    const numericOnly = text.replace(/\D/g, '');

    // Support paste 6 digit sekaligus
    if (numericOnly.length > 1) {
      const pasted = numericOnly.slice(0, OTP_LENGTH).split('');
      const nextDigits = [...digits];
      for (let i = 0; i < OTP_LENGTH; i++) {
        nextDigits[i] = pasted[i] ?? '';
      }
      setDigits(nextDigits);
      const targetFocus = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[targetFocus]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = numericOnly;
    setDigits(nextDigits);

    // Auto-forward ke kotak berikutnya
    if (numericOnly && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const nextDigits = [...digits];
      nextDigits[index - 1] = '';
      setDigits(nextDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const code = digits.join('');

  // Submit verifikasi ke backend Express POST /users/verify-otp
  const handleVerify = async () => {
    if (!email) {
      setErrorMsg('Alamat email tidak ditemukan. Silakan kembali dan coba lagi.');
      return;
    }
    if (code.length < OTP_LENGTH) {
      setErrorMsg('Masukkan 6 digit kode verifikasi.');
      return;
    }

    try {
      setVerifying(true);
      setErrorMsg('');

      const { user } = await verifyOtp(email, code, purpose);

      Alert.alert(
        'Verifikasi Berhasil',
        `Selamat datang, ${user.name}! Akunmu sudah aktif.`,
        [
          {
            text: 'Masuk ke Aplikasi',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error: any) {
      setErrorMsg(error?.message || 'Kode verifikasi salah atau kedaluwarsa.');
    } finally {
      setVerifying(false);
    }
  };

  // Kirim ulang OTP ke email POST /users/resend-otp
  const handleResend = async () => {
    if (cooldown > 0 || resending || !email) return;

    try {
      setResending(true);
      setErrorMsg('');
      const res = await resendOtp(email, purpose);
      setInfoMsg(res.message || 'Kode baru dikirim.');
      setDigits(Array(OTP_LENGTH).fill(''));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setErrorMsg(error?.message || 'Tunggu 1 menit sebelum meminta kode baru.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerBackground}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="mail-open-outline" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Verifikasi Email</Text>
            <Text style={styles.headerSubtitle}>
              Masukkan 6 digit kode yang dikirim ke{'\n'}
              <Text style={styles.emailHighlight}>{email || 'email kamu'}</Text>
            </Text>
          </View>
        </SafeAreaView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.formCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Banner Info */}
              {infoMsg ? (
                <View style={styles.infoBanner}>
                  <Text style={styles.infoBannerText}>{infoMsg}</Text>
                </View>
              ) : null}

              {/* Banner Error */}
              {errorMsg ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errorMsg}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Kode Verifikasi (6 Digit)</Text>

              {/* 6 OTP Box Inputs */}
              <View style={styles.otpRow}>
                {digits.map((digit, index) => {
                  const isFocused = focusedIndex === index;
                  const isFilled = Boolean(digit);
                  return (
                    <TextInput
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      style={[
                        styles.otpBox,
                        isFilled && styles.otpBoxFilled,
                        isFocused && styles.otpBoxFocused,
                      ]}
                      value={digit}
                      keyboardType="number-pad"
                      maxLength={index === 0 ? OTP_LENGTH : 1}
                      editable={!verifying}
                      selectTextOnFocus
                      onFocus={() => setFocusedIndex(index)}
                      onChangeText={(text) => handleDigitChange(text, index)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                      accessibilityLabel={`Digit OTP ${index + 1}`}
                    />
                  );
                })}
              </View>

              {/* Tombol Verifikasi */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (verifying || code.length < OTP_LENGTH) && styles.primaryButtonDisabled,
                ]}
                onPress={handleVerify}
                disabled={verifying || code.length < OTP_LENGTH}
                activeOpacity={0.8}
              >
                {verifying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verifikasi & Masuk</Text>
                )}
              </TouchableOpacity>

              {/* Tombol Kirim Ulang OTP */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Belum menerima kode?</Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={cooldown > 0 || resending}
                >
                  <Text
                    style={[
                      styles.resendLink,
                      (cooldown > 0 || resending) && styles.resendLinkDisabled,
                    ]}
                  >
                    {resending
                      ? 'Mengirim...'
                      : cooldown > 0
                      ? `Kirim ulang (${cooldown}d)`
                      : 'Kirim Ulang Kode'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </AnimatedScreen>
  );
}