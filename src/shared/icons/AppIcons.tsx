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

export function DashboardIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x="3" y="3" width="8" height="8" rx="2.2" />
      <Rect x="13" y="3" width="8" height="8" rx="2.2" />
      <Rect x="3" y="13" width="8" height="8" rx="2.2" />
      <Rect x="13" y="13" width="8" height="8" rx="2.2" />
    </Svg>
  );
}

export function SettingsIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x="3" y="5.4" width="18" height="2.2" rx="1.1" />
      <Rect x="3" y="10.9" width="18" height="2.2" rx="1.1" />
      <Rect x="3" y="16.4" width="18" height="2.2" rx="1.1" />
      <Circle cx="8" cy="6.5" r="2.9" />
      <Circle cx="15.5" cy="12" r="2.9" />
      <Circle cx="10.5" cy="17.5" r="2.9" />
    </Svg>
  );
}

export function LogOutIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M10.5 3H6.5A3.5 3.5 0 0 0 3 6.5v11A3.5 3.5 0 0 0 6.5 21h4a1.2 1.2 0 0 0 0-2.4h-4a1.1 1.1 0 0 1-1.1-1.1v-11A1.1 1.1 0 0 1 6.5 5.4h4a1.2 1.2 0 0 0 0-2.4" />
      <Path d="M16.35 7.75a1.2 1.2 0 0 0-1.7 1.7l1.35 1.35H10a1.2 1.2 0 0 0 0 2.4h6l-1.35 1.35a1.2 1.2 0 0 0 1.7 1.7l3.4-3.4a1.2 1.2 0 0 0 0-1.7z" />
    </Svg>
  );
}

/** Share glyph from the web app's space header. */
export function ShareIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="18" cy="5" r="3.2" />
      <Circle cx="6" cy="12" r="3.2" />
      <Circle cx="18" cy="19" r="3.2" />
      <Path d="M8.6 10.7 15.5 6.9l1.2 2.1-6.9 3.8zM9.8 11.9l6.9 3.8-1.2 2.1-6.9-3.8z" />
    </Svg>
  );
}

/** Cog from the web app's space settings button. */
export function GearIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
      <Path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
    </Svg>
  );
}

export function StarIcon({ color, size = 18, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinejoin="round">
      <Path d="M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.1 6.6 20l1-6.1-4.4-4.3 6.1-.9z" />
    </Svg>
  );
}

export function CloseIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M5.3 5.3a1.2 1.2 0 0 1 1.7 0L12 10.3l5-5a1.2 1.2 0 1 1 1.7 1.7l-5 5 5 5a1.2 1.2 0 0 1-1.7 1.7l-5-5-5 5a1.2 1.2 0 0 1-1.7-1.7l5-5-5-5a1.2 1.2 0 0 1 0-1.7" />
    </Svg>
  );
}

export function SearchIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        d="M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.19 4.19a1.2 1.2 0 0 1-1.7 1.7l-4.19-4.19A7.5 7.5 0 1 1 10.5 3m0 2.4a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2"
      />
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

export function FlashIcon({ color, size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M13.6 2.2 4.4 13.3a.9.9 0 0 0 .7 1.5H11l-1.1 7c-.1.6.6.9 1 .5l9.2-11.1a.9.9 0 0 0-.7-1.5H13.5l1.1-7c.1-.6-.6-.9-1-.5" />
    </Svg>
  );
}
