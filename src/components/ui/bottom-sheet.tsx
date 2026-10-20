import { BlurView } from 'expo-blur';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type PanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/styles/bottom-sheet.styles';
import { Spacing } from '@/theme';

export type BottomSheetContextType = {
  close: () => void;
  panGesture?: PanGesture;
};

export const BottomSheetContext = createContext<BottomSheetContextType>({
  close: () => {},
});

export const useBottomSheet = () => useContext(BottomSheetContext);

export type BottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
  showHandle?: boolean;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomSheet({
  onClose,
  children,
  showHandle = true,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const isClosing = useSharedValue(false);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 26,
      stiffness: 200,
      mass: 0.9,
    });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, [backdropOpacity, translateY]);

  const handleClose = useCallback(() => {
    if (isClosing.value) return;
    isClosing.value = true;

    translateY.value = withTiming(
      SCREEN_HEIGHT,
      {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      }
    );
    backdropOpacity.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.quad),
    });
  }, [backdropOpacity, isClosing, onClose, translateY]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY(5)
        .onUpdate((event) => {
          if (isClosing.value) return;

          if (event.translationY > 0) {
            translateY.value = event.translationY;
            const progress = Math.max(0, 1 - event.translationY / 380);
            backdropOpacity.value = progress;
          } else {
            translateY.value = event.translationY * 0.12;
          }
        })
        .onEnd((event) => {
          if (isClosing.value) return;

          if (event.translationY > 80 || event.velocityY > 500) {
            isClosing.value = true;
            translateY.value = withTiming(
              SCREEN_HEIGHT,
              {
                duration: 300,
                easing: Easing.out(Easing.cubic),
              },
              (finished) => {
                if (finished) {
                  runOnJS(onClose)();
                }
              }
            );
            backdropOpacity.value = withTiming(0, { duration: 260 });
          } else {
            translateY.value = withSpring(0, {
              damping: 24,
              stiffness: 240,
              mass: 0.8,
            });
            backdropOpacity.value = withTiming(1, { duration: 200 });
          }
        }),
    [backdropOpacity, isClosing, onClose, translateY]
  );

  const contextValue = useMemo(
    () => ({ close: handleClose, panGesture }),
    [handleClose, panGesture]
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <Modal
        transparent
        animationType="none"
        onRequestClose={handleClose}
        visible
        statusBarTranslucent
        navigationBarTranslucent
      >
        <GestureHandlerRootView style={styles.modalRoot}>
          <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
          >
            <Animated.View style={[StyleSheet.absoluteFill, backdropAnimatedStyle]}>
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
                onPress={handleClose}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sheet,
                {
                  paddingBottom: Math.max(insets.bottom, Spacing.md),
                  maxHeight: '90%',
                },
                sheetAnimatedStyle,
              ]}
            >
              {showHandle && (
                <GestureDetector gesture={panGesture}>
                  <View style={styles.handleArea}>
                    <View style={styles.handle} />
                  </View>
                </GestureDetector>
              )}
              {children}
            </Animated.View>
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </Modal>
    </BottomSheetContext.Provider>
  );
}