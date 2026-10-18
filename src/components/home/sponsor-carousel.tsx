import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { PillButton } from '@/components/ui/pill-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Layout, Radii, Shadows, Spacing } from '@/theme';
import type { Sponsor } from '@/types';

export type SponsorCarouselProps = {
  sponsors: Sponsor[] | null;
};

export function SponsorCarousel({ sponsors }: SponsorCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = Math.min(width, Layout.maxContentWidth) - Layout.marginMobile * 2;

  if (!sponsors) {
    return <Skeleton height={76} radius={Radii.lg} />;
  }

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / cardWidth));
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={sponsors}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(sponsor) => sponsor.id}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => <SponsorCard sponsor={item} width={cardWidth} />}
      />
      <View style={styles.dots}>
        {sponsors.map((sponsor, index) => (
          <View key={sponsor.id} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function SponsorCard({ sponsor, width }: { sponsor: Sponsor; width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.cardLeft}>
        <View style={styles.iconBox}>
          <Icon name={sponsor.icon} size={24} color={Colors.primary} filled />
        </View>
        <View style={styles.cardCopy}>
          <View style={styles.titleRow}>
            <AppText variant="labelMd" numberOfLines={1} style={styles.title}>
              {sponsor.title}
            </AppText>
            <Chip label="SPONSOR" variant="filled" size="sm" />
          </View>
          <AppText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={1}>
            {sponsor.tagline}
          </AppText>
        </View>
      </View>
      <PillButton
        label={sponsor.ctaLabel}
        size="sm"
        onPress={() => Alert.alert(`Membuka penawaran ${sponsor.title}!`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    padding: 14,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighSoft,
    ...Shadows.soft,
  },
  cardLeft: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    backgroundColor: Colors.primaryContainerSoft,
    borderWidth: 1,
    borderColor: Colors.primaryContainerEdge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: {
    flexShrink: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flexShrink: 1,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 4,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  dotActive: {
    width: 16,
    backgroundColor: Colors.primary,
  },
});
