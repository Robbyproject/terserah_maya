import { Platform } from 'react-native';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

// 10.0.2.2 hanya bermakna di emulator Android (alias ke localhost host).
// Di browser itu host yang tidak ada, jadi request menggantung lalu di-abort.
export const API_BASE_URL =
  Platform.OS === 'web'
    ? configuredBaseUrl.replace('://10.0.2.2', '://localhost')
    : configuredBaseUrl;

// Sementara sampai layar login memakai backend. Isi dengan `users.id` dari
// Supabase agar greeting di home menampilkan user sungguhan.
export const DEMO_USER_ID = process.env.EXPO_PUBLIC_DEMO_USER_ID ?? '';
