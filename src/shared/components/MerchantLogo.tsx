import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { env } from '@/config/env';
import { merchantInitials, merchantInitialsColor, merchantLogoPaths } from '@/core/utils/merchantUtils';
import { radius } from '@/theme';

import { AppText } from './AppText';

interface MerchantLogoProps {
  merchant: string | null;
  /** Domain from the merchant reference table; skips the domain guessing when present. */
  website: string | null;
  size?: number;
}

/** Merchant logo from logo.dev, trying each candidate URL in turn, then a coloured monogram. */
export function MerchantLogo({ merchant, website, size = 40 }: MerchantLogoProps) {
  const paths = env.logoDevToken ? merchantLogoPaths(merchant, website) : [];
  // Keyed by merchant so the attempt counter resets when a recycled list row shows a new merchant.
  const [failed, setFailed] = useState({ key: `${merchant}|${website}`, attempt: 0 });
  const key = `${merchant}|${website}`;
  const attempt = failed.key === key ? failed.attempt : 0;
  const path = paths[attempt];

  const box = { width: size, height: size, borderRadius: radius.full };

  if (path) {
    // fallback=404 is essential: without it logo.dev answers 202 with a generated monogram,
    // the image "loads", and our own initials fallback is never reached.
    const uri = `https://img.logo.dev/${path}?token=${env.logoDevToken}&size=${size * 3}&format=png&fallback=404`;
    return (
      <Image
        source={{ uri }}
        style={[box, styles.image]}
        contentFit="contain"
        accessibilityLabel={merchant ?? undefined}
        onError={() => setFailed({ key, attempt: attempt + 1 })}
      />
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={merchant ?? undefined}
      style={[box, styles.initials, { backgroundColor: merchantInitialsColor(merchant) }]}>
      <AppText variant="footnote" weight="700" style={styles.initialsText} maxFontSizeMultiplier={1}>
        {merchantInitials(merchant) || '?'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: '#FFFFFF' },
  initials: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: '#FFFFFF' },
});
