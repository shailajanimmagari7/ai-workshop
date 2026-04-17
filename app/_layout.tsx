import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { MiniPlayer } from '@/components/MiniPlayer';

export const unstable_settings = {
  anchor: '(tabs)',
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    primary: Colors.dark.tint,
  },
};

export default function RootLayout() {
  const initializeAudio = usePlayerStore((state) => state.initializeAudio);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const sound = usePlayerStore((state) => state.sound);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  const showMiniPlayer = currentSong !== null && sound !== null;

  return (
    <ThemeProvider value={customDarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="now-playing"
          options={{
            presentation: 'modal',
            title: 'Now Playing',
            headerShown: false,
          }}
        />
      </Stack>
      {showMiniPlayer && (
        <SafeAreaView edges={['bottom']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <MiniPlayer />
        </SafeAreaView>
      )}
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
