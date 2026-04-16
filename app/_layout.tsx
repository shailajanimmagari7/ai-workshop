import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { usePlayerStore } from '@/stores/usePlayerStore';

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

function MiniPlayer() {
  const { currentSong } = usePlayerStore();

  if (!currentSong) {
    return null;
  }

  return (
    <Link href="/now-playing" asChild>
      <Pressable style={styles.miniPlayer}>
        <View style={styles.miniPlayerContent}>
          <Text style={styles.miniPlayerTitle} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.miniPlayerArtist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        <Text style={styles.miniPlayerPlaceholder}>🎵</Text>
      </Pressable>
    </Link>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={customDarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="now-playing"
          options={{ presentation: 'modal', title: 'Now Playing' }}
        />
      </Stack>
      <SafeAreaView edges={['bottom']} style={styles.miniPlayerContainer}>
        <MiniPlayer />
      </SafeAreaView>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  miniPlayerContent: {
    flex: 1,
    marginRight: 12,
  },
  miniPlayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  miniPlayerArtist: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  miniPlayerPlaceholder: {
    fontSize: 24,
  },
});
