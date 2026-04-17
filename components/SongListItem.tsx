import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { usePlayerStore } from '@/stores/usePlayerStore';
import type { Song } from '@/types/Song';

interface SongListItemProps {
  song: Song;
  onPress: () => void;
  showPlayingIndicator?: boolean;
}

export function SongListItem({ song, onPress, showPlayingIndicator = true }: SongListItemProps) {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isCurrentSong = currentSong?.id === song.id;

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        isCurrentSong && styles.active,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {isCurrentSong && showPlayingIndicator ? (
          <Ionicons name="musical-notes" size={24} color={Colors.dark.accent} />
        ) : (
          <Ionicons name="musical-note" size={24} color={Colors.dark.textSecondary} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, isCurrentSong && styles.titleActive]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
      <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  pressed: {
    backgroundColor: Colors.dark.surface,
    marginHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  active: {
    backgroundColor: Colors.dark.surface,
    marginHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  titleActive: {
    color: Colors.dark.accent,
  },
  artist: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  duration: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textTertiary,
  },
});
