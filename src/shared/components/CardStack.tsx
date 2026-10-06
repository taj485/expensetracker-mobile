import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { radius, type Theme, useThemedStyles } from '@/theme';

import { useOpenProgress } from './Collapsible';

const MAX_LAYERS = 2;
/** How far each layer peeks out below the one above it. */
const PEEK = 6;
/** How much narrower each layer is than the one above it, per side. */
const INSET = 8;

interface CardStackProps {
  /** Stacked while collapsed; the layers tuck away behind the card as it opens. */
  expanded: boolean;
  /** How many things are folded away. Draws one layer per item, up to two. */
  count: number;
  children: ReactNode;
}

/** Draws card edges peeking out below its child while collapsed, so folded-away content reads as a stack. */
export function CardStack({ expanded, count, children }: CardStackProps) {
  const progress = useOpenProgress(expanded);
  const layers = Math.min(count, MAX_LAYERS);
  const spacerStyle = useAnimatedStyle(() => ({ paddingBottom: layers * PEEK * (1 - progress.get()) }));

  return (
    <Animated.View style={spacerStyle}>
      {/* Farthest layer first, so nearer layers and the card draw on top of it. */}
      {Array.from({ length: layers }, (_, i) => layers - i).map(depth => (
        <StackLayer key={depth} depth={depth} layers={layers} progress={progress} />
      ))}
      {children}
    </Animated.View>
  );
}

function StackLayer({ depth, layers, progress }: { depth: number; layers: number; progress: SharedValue<number> }) {
  const styles = useThemedStyles(createStyles);
  const animatedStyle = useAnimatedStyle(() => {
    const collapsed = 1 - progress.get();
    return {
      opacity: collapsed,
      // Each layer's bottom edge sits PEEK below the one above; all of them hide behind the card when open.
      transform: [{ translateY: -(layers - depth) * PEEK * collapsed }],
    };
  });

  return (
    <Animated.View
      importantForAccessibility="no-hide-descendants"
      style={[styles.layer, { left: depth * INSET, right: depth * INSET }, depth > 1 && styles.far, animatedStyle]}
    />
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    layer: {
      position: 'absolute',
      pointerEvents: 'none',
      bottom: 0,
      height: radius.lg * 2,
      backgroundColor: colors.bgSurface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
    },
    far: { borderColor: colors.borderDefault },
  });
