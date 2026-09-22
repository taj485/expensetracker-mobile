import Svg, { Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { purple } from '@/theme';

interface MascotProps {
  width?: number;
}

/** The Recave receipt character in sunglasses, from the mobile mockup's welcome screen. */
export function Mascot({ width = 168 }: MascotProps) {
  const height = (width * 145) / 120;

  return (
    <Svg width={width} height={height} viewBox="0 0 120 145" fill="none" accessibilityLabel="Recave mascot">
      {/* glow pool beneath the character */}
      <Ellipse cx="58" cy="134" rx="31" ry="5.5" fill={purple[500]} opacity={0.55} />

      {/* sparkles */}
      <G fill={purple[300]}>
        <Path d="M0 -7.5 L2.2 -2.2 L7.5 0 L2.2 2.2 L0 7.5 L-2.2 2.2 L-7.5 0 L-2.2 -2.2 Z" transform="translate(15,50)" />
        <Path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" transform="translate(105,38)" />
        <Path d="M0 -4 L1.2 -1.2 L4 0 L1.2 1.2 L0 4 L-1.2 1.2 L-4 0 L-1.2 -1.2 Z" transform="translate(103,92)" />
      </G>

      {/* receipt body, torn top and bottom */}
      <Path
        d="M26 30 L34 24 L42 30 L50 24 L58 30 L66 24 L74 30 L82 24 L90 30 L90 122 L82 128 L74 122 L66 128 L58 122 L50 128 L42 122 L34 128 L26 122 Z"
        fill="#FFFFFF"
        stroke={purple[400]}
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {/* brows */}
      <Path d="M34 48 h13 M69 48 h13" stroke={purple[400]} strokeWidth={3} strokeLinecap="round" />

      {/* sunglasses */}
      <Rect x="32" y="54" width="24" height="17" rx="5" fill={purple[900]} />
      <Rect x="60" y="54" width="24" height="17" rx="5" fill={purple[900]} />
      <Path d="M56 60.5 h4" stroke={purple[900]} strokeWidth={3.5} />
      <Path d="M38 57 l5 0 -7 8 -1.5 -4 Z" fill="#FFFFFF" opacity={0.3} />
      <Path d="M66 57 l5 0 -7 8 -1.5 -4 Z" fill="#FFFFFF" opacity={0.3} />

      {/* smile */}
      <Path d="M50 80 q8 8 16 0" stroke={purple[900]} strokeWidth={3} strokeLinecap="round" fill="none" />

      {/* line items and total */}
      <Path d="M36 97 h25 M36 107 h19" stroke={purple[600]} strokeWidth={4} strokeLinecap="round" />
      <SvgText x="75" y="110" textAnchor="middle" fontSize="27" fontWeight="700" fill={purple[600]}>
        £
      </SvgText>
    </Svg>
  );
}
