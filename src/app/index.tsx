// src/app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../components/animated-screen';
import { Colors } from '../constants/theme';
import { styles } from '../styles/index.styles';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <AnimatedScreen>
      <LinearGradient
        colors={['#0284C7', '#38BDF8', '#F8FAFC']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.outerCircle}>
                <View style={styles.iconCircle}>
                  <Ionicons name="sparkles" size={40} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.title}>Terserah App</Text>
            </View>

            {/* Text Informasi & Tombol */}
            <View style={styles.footerSection}>
              <Text style={styles.subtitle}>
                Solusi Bagi Kalian Yang Bingung Mencari Tempat Makan Yang Bukan Itu Itu Aja
              </Text>

              {/* Tombol Pilihan */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/login' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlinedButton}
                onPress={() => router.push('/register' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.outlinedButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </AnimatedScreen>
  );
}