import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import { Animated, Platform } from 'react-native';

import { SpacesSidebar } from './components/SpacesSidebar';

interface SpacesSidebarContextValue {
  open: () => void;
  close: () => void;
}

const SpacesSidebarContext = createContext<SpacesSidebarContextValue | null>(null);

const OPEN_MS = 220;
const CLOSE_MS = 180;
// The native driver isn't available on web; it falls back to JS-driven animation there.
const useNativeDriver = Platform.OS !== 'web';

/**
 * Owns the space-switcher sidebar (web app / mockup "Sidebar — switch space") so any screen or
 * the tab bar can open it. Animation runs from the open/close handlers rather than an effect.
 */
export function SpacesSidebarProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  // Created once and never replaced; state (not a ref) so it can be read during render.
  const [progress] = useState(() => new Animated.Value(0));

  const value = useMemo<SpacesSidebarContextValue>(
    () => ({
      open: () => {
        setVisible(true);
        Animated.timing(progress, { toValue: 1, duration: OPEN_MS, useNativeDriver }).start();
      },
      close: () => {
        Animated.timing(progress, { toValue: 0, duration: CLOSE_MS, useNativeDriver }).start(({ finished }) => {
          if (finished) setVisible(false);
        });
      },
    }),
    [progress],
  );

  return (
    <SpacesSidebarContext.Provider value={value}>
      {children}
      <SpacesSidebar visible={visible} progress={progress} onClose={value.close} />
    </SpacesSidebarContext.Provider>
  );
}

export function useSpacesSidebar(): SpacesSidebarContextValue {
  const context = useContext(SpacesSidebarContext);
  if (!context) {
    throw new Error('useSpacesSidebar must be used inside SpacesSidebarProvider');
  }
  return context;
}
