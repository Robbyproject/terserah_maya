import { useCallback, useMemo, type ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type AnimatedScreenProps = {
  children: ReactNode;
};

export function AnimatedScreen({ children }: AnimatedScreenProps) {
  const router = useRouter();
  const dragX = useSharedValue(0);
  const canGoBack = router.canGoBack();

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(canGoBack)
        .hitSlop({ left: 0, width: 32 })
        .activeOffsetX(8)
        .failOffsetY([-12, 12])
        .onUpdate((event) => {
          dragX.value = Math.max(0, event.translationX);
        })
        .onEnd((event) => {
          if (event.translationX > 110 || event.velocityX > 900) {
            dragX.value = withTiming(72, { duration: 110 }, (finished) => {
              if (finished) {
                runOnJS(goBack)();
              }
            });
          } else {
            dragX.value = withSpring(0, { damping: 18, stiffness: 180 });
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dragX adalah shared value Reanimated: nilainya stabil selama komponen hidup, tidak wajib jadi dependency
    [canGoBack, goBack]
  );

  const dragStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(dragX.value / 600, 0.16),
    transform: [
      { translateX: dragX.value },
      { scale: 1 - Math.min(dragX.value / 600, 0.05) },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={styles.container}>
        <Animated.View style={[styles.container, dragStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
