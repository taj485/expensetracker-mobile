import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const DURATION_MS = 220;

/** 0 when closed, 1 when open, animating between the two whenever `open` changes. */
export function useOpenProgress(open: boolean) {
  const progress = useSharedValue(open ? 1 : 0);
  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, { duration: DURATION_MS, easing: Easing.out(Easing.cubic) }));
  }, [open, progress]);
  return progress;
}

interface CollapsibleProps {
  expanded: boolean;
  children: ReactNode;
}

/** Shows or hides its children by animating their height. Collapsed children stay mounted but can't be tapped or reached by screen readers. */
export function Collapsible({ expanded, children }: CollapsibleProps) {
  const progress = useOpenProgress(expanded);
  const contentHeight = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    // 'auto' once fully open, so content that changes size later isn't clipped.
    height: progress.get() === 1 ? 'auto' : contentHeight.get() * progress.get(),
  }));

  return (
    <Animated.View
      style={[styles.clip, { pointerEvents: expanded ? 'auto' : 'none' }, animatedStyle]}
      accessibilityElementsHidden={!expanded}
      importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}>
      <View onLayout={e => contentHeight.set(e.nativeEvent.layout.height)}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({ clip: { overflow: 'hidden' } });
