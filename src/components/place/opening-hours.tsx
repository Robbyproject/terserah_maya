import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { OpeningHoursDay } from '@/types/place';

// Urutan tampil Senin..Minggu (day: 0 = Minggu)
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

type Props = {
  hours: OpeningHoursDay[];
  /** 0 = Minggu ... 6 = Sabtu. Default: hari ini. */
  today?: number;
};

export function OpeningHours({ hours, today = new Date().getDay() }: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const todayEntry = hours.find((h) => h.day === today);
  const rows = WEEK_ORDER.map((day) => hours.find((h) => h.day === day)).filter(
    (h): h is OpeningHoursDay => h !== undefined
  );

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel="Jadwal jam buka"
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
        onPress={() => setExpanded((value) => !value)}>
        <ThemedText type="smallBold">
          {todayEntry ? `Hari ini ${todayEntry.hours}` : 'Jam buka tidak tersedia'}
        </ThemedText>
        <SymbolView
          name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
          tintColor={theme.text}
          size={14}
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {expanded ? (
        <View style={[styles.week, { borderTopColor: theme.border }]}>
          {rows.map((row) => {
            const isToday = row.day === today;
            return (
              <View key={row.day} style={styles.weekRow}>
                <ThemedText type={isToday ? 'smallBold' : 'small'} themeColor={isToday ? 'text' : 'textSecondary'}>
                  {row.label}
                </ThemedText>
                <ThemedText type={isToday ? 'smallBold' : 'small'} themeColor={isToday ? 'text' : 'textSecondary'}>
                  {row.hours}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },
  pressed: { opacity: 0.7 },
  week: { borderTopWidth: 1, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
});