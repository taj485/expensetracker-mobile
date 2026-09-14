import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Filled 24×24 glyphs from the Recave mobile mockup (Client/mockups/recave-mobile.html).
// They take a `color`, so each icon follows its control's state.

export interface IconProps {
  color: string;
  size?: number;
}

export function HomeIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M11.36 2.79a1 1 0 0 1 1.28 0l8.5 7.1a1 1 0 0 1 .36.77V20a2 2 0 0 1-2 2h-4.25v-5.7a1.25 1.25 0 0 0-1.25-1.25h-3.6a1.25 1.25 0 0 0-1.25 1.25V22H4.5a2 2 0 0 1-2-2v-9.34a1 1 0 0 1 .36-.77z" />
    </Svg>
  );
}

export function ExpensesIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="4.7" cy="6.5" r="1.7" />
      <Circle cx="4.7" cy="12" r="1.7" />
      <Circle cx="4.7" cy="17.5" r="1.7" />
      <Rect x="8.6" y="5.3" width="11.6" height="2.4" rx="1.2" />
      <Rect x="8.6" y="10.8" width="11.6" height="2.4" rx="1.2" />
      <Rect x="8.6" y="16.3" width="11.6" height="2.4" rx="1.2" />
    </Svg>
  );
}

export function ScanIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {/* viewfinder corners */}
      <Path d="M2.8 10V6.2A3.4 3.4 0 0 1 6.2 2.8H10v2.5H6.2a.9.9 0 0 0-.9.9V10z" />
      <Path d="M21.2 10V6.2a3.4 3.4 0 0 0-3.4-3.4H14v2.5h3.8a.9.9 0 0 1 .9.9V10z" />
      <Path d="M21.2 14v3.8a3.4 3.4 0 0 1-3.4 3.4H14v-2.5h3.8a.9.9 0 0 0 .9-.9V14z" />
      <Path d="M2.8 14v3.8a3.4 3.4 0 0 0 3.4 3.4H10v-2.5H6.2a.9.9 0 0 1-.9-.9V14z" />
      {/* receipt with a torn bottom edge; line items knocked out */}
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 7.3h7v9.4l-1.75-1.2-1.75 1.2-1.75-1.2L8.5 16.7zm1.7 2.5h3.6v1.3h-3.6zm0 2.4h2.4v1.3h-2.4z"
      />
    </Svg>
  );
}

export function AddIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2m1.2 5.3a1.2 1.2 0 0 0-2.4 0v3.1H7.7a1.2 1.2 0 0 0 0 2.4h3.1v3.1a1.2 1.2 0 0 0 2.4 0v-3.1h3.1a1.2 1.2 0 0 0 0-2.4h-3.1z"
      />
    </Svg>
  );
}

export function ProfileIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="12" cy="7.8" r="4.1" />
      <Path d="M12 13.7c-4.1 0-7.4 2.7-7.4 6 0 .9.7 1.6 1.6 1.6h11.6c.9 0 1.6-.7 1.6-1.6 0-3.3-3.3-6-7.4-6" />
    </Svg>
  );
}

export function SpacesIcon({ color, size = 17 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M3 7.2a3 3 0 0 1 3-3h3.1a2 2 0 0 1 1.5.7l1 1.1H18a3 3 0 0 1 3 3v.5H3z" />
      <Path d="M3 11h18v6.8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
    </Svg>
  );
}

export function InsightsIcon({ color, size = 17 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x="3" y="3.4" width="2.3" height="17.2" rx="1.15" />
      <Rect x="3" y="18.3" width="18" height="2.3" rx="1.15" />
      <Rect x="7.4" y="12.6" width="2.6" height="5.7" rx="1.3" />
      <Rect x="11.7" y="8.4" width="2.6" height="9.9" rx="1.3" />
      <Rect x="16" y="10.4" width="2.6" height="7.9" rx="1.3" />
    </Svg>
  );
}
