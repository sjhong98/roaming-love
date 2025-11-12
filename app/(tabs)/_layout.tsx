import * as Haptics from 'expo-haptics';
import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, TripIcon, ExploreIcon, ChatIcon, MyIcon } from '@/components/ui/TabIcons';

const TABS = [
  {
    key: 'main',
    title: 'Home',
    href: '/main' as const,
    Icon: HomeIcon,
  },
  {
    key: 'trip',
    title: 'Trip',
    href: '/trip' as const,
    Icon: TripIcon,
  },
  {
    key: 'explore',
    title: 'Explore',
    href: '/explore' as const,
    Icon: ExploreIcon,  
  },
  {
    key: 'chat',
    title: 'Chat',
    href: '/chat' as const,
    Icon: ChatIcon,
  },
  {
    key: 'my',
    title: 'My',
    href: '/my' as const,
    Icon: MyIcon,
  },
] as const;

const TAB_BAR_BASE_HEIGHT = 73;

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigate = useCallback(
    (href: (typeof TABS)[number]['href']) => {
      if (pathname !== href) {
        router.replace(href);
      }
    },
    [pathname, router]
  );

  const handlePressIn = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
        /* noop */
      });
    }
  }, []);

  const renderTab = useCallback(
    ({ key, title, href, Icon }: (typeof TABS)[number]) => {
      const isFocused = pathname === href || pathname.startsWith(`${href}/`);

      return (
        <Pressable
          key={key}
          onPress={() => handleNavigate(href)}
          onPressIn={handlePressIn}
          style={({ pressed }) => [styles.tabButton, pressed ? styles.tabButtonPressed : null]}
        >
          <Icon focused={isFocused} size={28} />
          <Text style={[styles.tabLabel]}>{title}</Text>
        </Pressable>
      );
    },
    [handleNavigate, handlePressIn, pathname]
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Slot />
      </View>
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 10),
            height: TAB_BAR_BASE_HEIGHT + insets.bottom,
          },
        ]}
      >
        {TABS.map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#EFEFF0',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    paddingTop: 5,
    zIndex: 1000,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonPressed: {
    opacity: 0.6,
  },
  tabLabel: {
    fontSize: 12,
    color: '#444444',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: '#FF2D55',
    fontWeight: '600',
  },
});
