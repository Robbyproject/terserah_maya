import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { Colors, Layout, Radii, Spacing } from '@/theme';

export type BottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent animationType="none" onRequestClose={onClose} visible>
      <View style={styles.root}>
        <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={30}
            tint="dark"
            blurMethod="dimezisBlurViewSdk31Plus"
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, styles.backdropTint]} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup kriteria"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(180)}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, Spacing.md) },
          ]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTint: {
    backgroundColor: Colors.overlayInverse,
  },
  sheet: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    maxHeight: '88%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
  },
});
