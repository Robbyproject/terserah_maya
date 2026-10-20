import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  onGo: () => void;
  onAnother: () => void;
  goLabel?: string;
  anotherLabel?: string;
};

/** Tombol aksi inline (ikut ter-scroll), ditaruh tepat di bawah header supaya terlihat di posisi half. */
export function PlaceActions({
  onGo,
  onAnother,
  goLabel = 'Gas ke Sini! 🚀',
  anotherLabel = 'Cari Lain 🎲',
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        onPress={onGo}
        style={({ pressed }) => [
          styles.primary,
          { backgroundColor: theme.primary, shadowColor: theme.primary },
          pressed && styles.pressed,
        ]}>
        <ThemedText style={[styles.primaryText, { color: theme.onPrimary }]}>{goLabel}</ThemedText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onAnother}
        style={({ pressed }) => [
          styles.secondary,
          { backgroundColor: theme.backgroundSelected },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="smallBold" themeColor="secondary">
          {anotherLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  primary: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.full,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryText: { fontFamily: FontFamily.bold, fontSize: 16, lineHeight: 22 },
  secondary: { flex: 2, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.full },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});