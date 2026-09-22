import { StyleSheet, View } from 'react-native';

import { radius, useTheme } from '@/theme';

import { AppText } from './AppText';

interface AvatarProps {
  name: string | undefined;
  size?: number;
}

export function Avatar({ name, size = 42 }: AvatarProps) {
  const { colors } = useTheme();
  const initial = (name ?? '').trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      accessible
      accessibilityLabel={name}
      style={[styles.circle, { width: size, height: size, backgroundColor: colors.bgBrandSoft }]}>
      <AppText variant="subhead" weight="700" tone="brand" maxFontSizeMultiplier={1}>
        {initial}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
});
