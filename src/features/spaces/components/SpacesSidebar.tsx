import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isUserCancelled } from '@/core/auth/authErrors';
import { useSession } from '@/core/auth/useSession';
import type { Expense } from '@/core/models/expense.model';
import { queryKeys } from '@/core/queries/queryKeys';
import { useToggleStar } from '@/core/queries/spaceQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { AppText } from '@/shared/components/AppText';
import { Avatar } from '@/shared/components/Avatar';
import { Wordmark } from '@/shared/components/Wordmark';
import { CloseIcon, DashboardIcon, LogOutIcon, SettingsIcon } from '@/shared/icons/AppIcons';
import { confirm } from '@/shared/utils/confirm';
import { radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

import { SidebarNavItem } from './SidebarNavItem';
import { SpaceRow } from './SpaceRow';

const MAX_WIDTH = 300;

interface SpacesSidebarProps {
  visible: boolean;
  /** 0 = closed, 1 = open; drives the slide and the scrim fade. */
  progress: Animated.Value;
  onClose: () => void;
}

/** Slide-in panel for switching space — the mobile version of the web app's sidebar. */
export function SpacesSidebar({ visible, progress, onClose }: SpacesSidebarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { user, signOut } = useSession();
  const { spaces, selectedSpace, selectSpace } = useSelectedSpace();
  const toggleStar = useToggleStar();

  const width = Math.min(MAX_WIDTH, screenWidth * 0.85);
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] });
  // Starred space first, then the rest in the order the API returns them.
  const orderedSpaces = [...spaces].sort((a, b) => Number(b.isStarred) - Number(a.isStarred));

  const goTo = (href: '/' | '/profile' | '/new-space') => {
    onClose();
    router.navigate(href);
  };

  const confirmSignOut = async () => {
    onClose();
    const confirmed = await confirm({
      title: 'Log out?',
      message: "You'll need to sign in again to see your spaces.",
      confirmLabel: 'Log out',
      destructive: true,
    });
    if (!confirmed) return;
    try {
      await signOut();
    } catch (e) {
      if (!isUserCancelled(e)) {
        await confirm({ title: 'Sign-out failed', message: 'Please try again.', confirmLabel: 'OK' });
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.fill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
          <Pressable style={styles.fill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close spaces menu" />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          style={[styles.panel, { width, transform: [{ translateX }], paddingTop: insets.top + spacing.base, paddingBottom: insets.bottom + spacing.base }]}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <AppText variant="headline" weight="700" tone="onBrand" maxFontSizeMultiplier={1}>
                  R
                </AppText>
              </View>
              <View style={styles.fill}>
                <Wordmark size={18} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close spaces menu"
                onPress={onClose}
                hitSlop={spacing.sm}
                style={styles.closeButton}>
                <CloseIcon color={colors.iconDefault} size={14} />
              </Pressable>
            </View>

            <View style={styles.userCard}>
              <Avatar name={user?.name} size={40} />
              <View style={styles.fill}>
                <AppText variant="footnote" weight="600" numberOfLines={1}>
                  {user?.name}
                </AppText>
                <AppText variant="caption1" tone="secondary" numberOfLines={1}>
                  {user?.email}
                </AppText>
              </View>
            </View>

            <SidebarNavItem label="Dashboard" Icon={DashboardIcon} onPress={() => goTo('/')} />

            <AppText variant="caption2" weight="600" tone="secondary" style={styles.heading} accessibilityRole="header">
              Spaces
            </AppText>

            <View style={styles.list}>
              {orderedSpaces.map(space => (
                <SpaceRow
                  key={space.id}
                  space={space}
                  active={space.id === selectedSpace?.id}
                  count={queryClient.getQueryData<Expense[]>(queryKeys.expenses(space.id))?.length}
                  canToggleStar={spaces.length > 1}
                  onSelect={() => {
                    selectSpace(space.id);
                    onClose();
                  }}
                  onToggleStar={() => toggleStar.mutate(space)}
                />
              ))}

              <Pressable
                accessibilityRole="button"
                onPress={() => goTo('/new-space')}
                style={({ pressed }) => [styles.newSpace, pressed && { backgroundColor: colors.bgSurfaceAlt }]}>
                <AppText variant="footnote" weight="600" tone="secondary">
                  + New space
                </AppText>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <SidebarNavItem label="Profile" Icon={SettingsIcon} onPress={() => goTo('/profile')} />
              <SidebarNavItem label="Log out" Icon={LogOutIcon} onPress={confirmSignOut} />
              <AppText variant="caption2" tone="secondary" style={styles.version}>
                {`Recave v${Constants.expoConfig?.version ?? '1.0'}`}
              </AppText>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = ({ colors, shadowBrand }: Theme) =>
  StyleSheet.create({
    fill: { flex: 1 },
    scrim: { backgroundColor: 'rgba(23, 21, 38, 0.45)' },
    panel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: colors.bgElevated,
      paddingHorizontal: spacing.base,
      boxShadow: '0 12px 32px -4px rgba(23, 21, 38, 0.14)',
    },
    content: { flexGrow: 1, gap: spacing['2xs'] },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.lg },
    brandMark: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      backgroundColor: colors.bgBrand,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: shadowBrand,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.bgPage,
      marginBottom: spacing.md,
    },
    heading: {
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      paddingTop: spacing.base,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.sm,
    },
    list: { gap: spacing['2xs'] },
    newSpace: {
      marginTop: spacing.md,
      minHeight: 44,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      marginTop: 'auto',
      paddingTop: spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderDefault,
      gap: spacing['2xs'],
    },
    version: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  });
