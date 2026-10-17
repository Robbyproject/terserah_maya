import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PlacePhoto } from '@/types/place';

type Props = {
  photos: PlacePhoto[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  height?: number;
};


const FAVORITE_ACTIVE = '#e11d48';

export function PlaceHero({ photos, isFavorite, onToggleFavorite, height = 150 }: Props) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const hasPhotos = photos.length > 0;

  return (
    <View
      style={[styles.container, { height, backgroundColor: theme.backgroundSelected }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {hasPhotos && width > 0 ? (
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={photos}
          keyExtractor={(photo) => photo.uri}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={{ width, height }} contentFit="cover" />
          )}
        />
      ) : (
        <View style={styles.placeholder}>
          <SymbolView
            name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
            tintColor={theme.primary}
            size={40}
          />
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        accessibilityState={{ selected: isFavorite }}
        onPress={onToggleFavorite}
        
        style={({ pressed }) => [styles.favorite, pressed && styles.favoritePressed]}>
        <SymbolView
          name={{ 
            ios: isFavorite ? 'heart.fill' : 'heart',
            android: 'favorite',
            web: 'favorite',
          }}
          tintColor={isFavorite ? FAVORITE_ACTIVE : '#0f172a'}
          size={20}
          style={styles.favoriteIcon}
        />
      </Pressable>

      {hasPhotos ? (
        <>
          <View style={styles.dots} pointerEvents="none">
            {photos.map((photo, i) => (
              <View key={photo.uri} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
          <ThemedText style={styles.credit}>Foto: {photos[index]?.attribution ?? 'Google Maps'}</ThemedText>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 20, overflow: 'hidden' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  favorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  favoritePressed: { transform: [{ scale: 0.9 }] },
  favoriteIcon: { width: 20, height: 20, transform: [{ translateX: 1.5 }, { translateY: 1.5 }] },
  dots: { position: 'absolute', bottom: Spacing.two, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.55)' },
  dotActive: { width: 18, backgroundColor: '#ffffff' },
  credit: { position: 'absolute', bottom: 6, right: 10, fontSize: 10, lineHeight: 14, color: 'rgba(255,255,255,0.9)' },
});