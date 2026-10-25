import { Platform } from 'react-native';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

// 10.0.2.2 hanya bermakna di emulator Android (alias ke localhost host).
// Di browser itu host yang tidak ada, jadi request menggantung lalu di-abort.
//
// Konvensi: nilai ini adalah ORIGIN tanpa "/api". Setiap service menambahkan
// path /api/... sendiri (lihat src/lib/api.ts dan src/services/user.service.ts).
export const API_BASE_URL =
  Platform.OS === 'web'
    ? configuredBaseUrl.replace('://10.0.2.2', '://localhost')
    : configuredBaseUrl;
