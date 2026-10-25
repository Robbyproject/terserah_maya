import { Colors } from '@/constants/theme';

/**
 * Warna aktif untuk `ThemedText` / `ThemedView` (dipakai komponen place & sheet detail).
 *
 * Sengaja selalu memakai palet terang: UI development (`@/theme`) belum punya varian
 * gelap, jadi kalau sheet ikut `useColorScheme()` dia akan gelap sementara kartu dan
 * layar di belakangnya tetap terang — kelihatan nabrak. Dark mode di
 * `Colors.dark` sudah disiapkan; kalau nanti seluruh app dapat tema gelap,
 * kembalikan baris ini ke `useColorScheme() === 'dark' ? Colors.dark : Colors.light`.
 */
export function useTheme() {
  return Colors.light;
}
