import { useCallback, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { Colors, Spacing, FontSizes } from '@/constants/theme';

interface SeekBarProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
}

function formatTime(ms: number): string {
  if (!ms || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export const SeekBar = memo(function SeekBar({ position, duration, onSeek }: SeekBarProps) {
  const handleSeek = useCallback(
    (value: number) => {
      onSeek(value);
    },
    [onSeek]
  );

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration || 1}
        value={position}
        onSlidingComplete={handleSeek}
        minimumTrackTintColor={Colors.dark.accent}
        maximumTrackTintColor={Colors.dark.surface}
        thumbTintColor={Colors.dark.accent}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textTertiary,
  },
});
