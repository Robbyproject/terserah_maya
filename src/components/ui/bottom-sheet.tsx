
import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Layout, Radii, Spacing } from '@/theme';

export type BottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({
  onClose,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      animationType="none"
      onRequestClose={onClose}
      visible
      statusBarTranslucent
      navigationBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        {/* Background overlay */}
        <View style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={30}
            tint="dark"
            blurMethod="dimezisBlurViewSdk31Plus"
            style={StyleSheet.absoluteFill}
          />

          <View
            style={[
              StyleSheet.absoluteFill,
              styles.backdropTint,
            ]}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup kriteria"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Bottom sheet */}
        <View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(
                insets.bottom,
                Spacing.md,
              ),
              maxHeight: '88%',
            },
          ]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    overflow: 'hidden',
  },
});
