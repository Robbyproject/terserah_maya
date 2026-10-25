import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MaterialSymbols_400Regular } from '@expo-google-fonts/material-symbols/400Regular';
import { MaterialSymbols_400Regular_Filled } from '@expo-google-fonts/material-symbols/400Regular_Filled';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { MatchFlowModals } from '@/components/match/match-flow-modals';
import { TerserahTabBar } from '@/components/navigation/tab-bar';
import { useMatchFlow } from '@/hooks/use-match-flow';
import { useSavedCriteria } from '@/hooks/use-saved-criteria';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // Inisialisasi Hook Match Flow & Criteria secara Global
  const flow = useMatchFlow();
  const criteria = useSavedCriteria();

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    MaterialSymbols_400Regular,
    MaterialSymbols_400Regular_Filled,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Tampilkan TabBar hanya untuk rute utama
  const tabRoutes = ['/home', '/match', '/profile'];
  const showTabBar = tabRoutes.some((route) => pathname.startsWith(route));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <AnimatedSplashOverlay />

        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 280,
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="changepassword" />

            {/* Halaman ganti password dari Profile */}
            <Stack.Screen
              name="change-password"
              options={{
                animation: 'slide_from_right',
              }}
            />

            {/* Halaman Favorites (Lihat Semua dari Home) */}
            <Stack.Screen
              name="favorites"
              options={{
                animation: 'slide_from_right',
                gestureEnabled: true,
              }}
            />

            {/* Saat ke Home, layar masuk dari KIRI (konsisten karena Home berada di tab kiri) */}
            <Stack.Screen
              name="home"
              options={{
                animation: 'slide_from_left',
              }}
            />

            <Stack.Screen name="match" />

            {/* Saat ke Profile, layar masuk dari KANAN (konsisten karena Profile berada di tab kanan) */}
            <Stack.Screen
              name="profile"
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack>

          {/* Pasang onMatchPress={flow.openSheet} ke TabBar */}
          {showTabBar && <TerserahTabBar onMatchPress={flow.openSheet} />}

          {/* Render Modal Match Flow secara Global */}
          <MatchFlowModals flow={flow} criteria={criteria} />
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}