import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { SeekBar } from '@/components/SeekBar';
import { PlaybackControls } from '@/components/PlaybackControls';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARTWORK_SIZE = SCREEN_WIDTH - Spacing.xl * 2;

export function NowPlayingScreen() {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) => state.duration);
  const seek = usePlayerStore((state) => state.seek);

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleClose} hitSlop={12}>
          <Ionicons name="chevron-down" size={28} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.artworkContainer}>
        <View style={styles.artwork}>
          <Ionicons name="musical-notes" size={120} color={Colors.dark.textSecondary} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {currentSong?.title || 'No Song'}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentSong?.artist || 'Unknown Artist'}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <SeekBar
          position={position}
          duration={duration}
          onSeek={seek}
        />
      </View>

      <View style={styles.controlsContainer}>
        <PlaybackControls />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  artworkContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  artist: {
    fontSize: FontSizes.lg,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  progressContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  controlsContainer: {
    paddingTop: Spacing.lg,
  },
});
