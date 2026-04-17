import { useCallback, memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing } from '@/constants/theme';
import { usePlayerStore } from '@/stores/usePlayerStore';

export const PlaybackControls = memo(function PlaybackControls() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const repeatMode = usePlayerStore((state) => state.repeatMode);
  const isShuffled = usePlayerStore((state) => state.isShuffled);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const next = usePlayerStore((state) => state.next);
  const previous = usePlayerStore((state) => state.previous);
  const toggleRepeat = usePlayerStore((state) => state.toggleRepeat);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);

  const getRepeatIcon = useCallback((): 'repeat' | 'repeat-outline' | 'infinite' => {
    switch (repeatMode) {
      case 'one':
        return 'repeat-outline';
      case 'all':
        return 'repeat';
      default:
        return 'repeat-outline';
    }
  }, [repeatMode]);

  const getRepeatColor = useCallback(() => {
    return repeatMode === 'off' ? Colors.dark.textTertiary : Colors.dark.accent;
  }, [repeatMode]);

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleShuffle} hitSlop={12}>
        <Ionicons
          name="shuffle"
          size={24}
          color={isShuffled ? Colors.dark.accent : Colors.dark.textTertiary}
        />
      </Pressable>
      <Pressable onPress={previous} hitSlop={12} style={styles.controlButton}>
        <Ionicons name="play-skip-back" size={36} color={Colors.dark.text} />
      </Pressable>
      <Pressable onPress={togglePlayPause} hitSlop={12} style={styles.playButton}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={48}
          color={Colors.dark.text}
        />
      </Pressable>
      <Pressable onPress={next} hitSlop={12} style={styles.controlButton}>
        <Ionicons name="play-skip-forward" size={36} color={Colors.dark.text} />
      </Pressable>
      <Pressable onPress={toggleRepeat} hitSlop={12}>
        <Ionicons name={getRepeatIcon()} size={24} color={getRepeatColor()} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  controlButton: {
    padding: Spacing.sm,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.dark.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
