import { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { usePlayerStore } from '@/stores/usePlayerStore';
import {
  requestPermissions,
  getPermissionStatus,
  createPermissionListener,
} from '@/services/permissionService';
import { discoverSongs } from '@/services/musicDiscoveryService';
import { PermissionDeniedView } from '@/components/PermissionDeniedView';
import type { Song } from '@/types/Song';

type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export default function SongsScreen() {
  const permissionStatus = usePlayerStore((state) => state.permissionStatus);
  const setPermissionStatus = usePlayerStore((state) => state.setPermissionStatus);

  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [songs, setSongs] = useState<Song[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loadSongs = useCallback(async () => {
    setLoadingState('loading');
    setErrorMessage('');

    const { songs: discoveredSongs, error } = await discoverSongs();

    if (error) {
      setLoadingState('error');
      setErrorMessage(error.message);
      setSongs([]);
      return;
    }

    if (discoveredSongs.length === 0) {
      setLoadingState('empty');
      setSongs([]);
      return;
    }

    setSongs(discoveredSongs);
    setLoadingState('success');
  }, []);

  const handlePermissionResult = useCallback(
    async (status: 'granted' | 'denied' | 'blocked' | 'undetermined') => {
      setPermissionStatus(status);

      if (status === 'granted') {
        await loadSongs();
      } else {
        setLoadingState('idle');
      }
    },
    [setPermissionStatus, loadSongs]
  );

  const checkAndRequestPermissions = useCallback(async () => {
    let status = await getPermissionStatus();

    if (status === 'undetermined') {
      status = await requestPermissions();
    }

    await handlePermissionResult(status);
  }, [handlePermissionResult]);

  useEffect(() => {
    checkAndRequestPermissions();
  }, [checkAndRequestPermissions]);

  useEffect(() => {
    const cleanup = createPermissionListener(async () => {
      const { getPermissionStatus: checkStatus } = await import('@/services/permissionService');
      const status = await checkStatus();
      setPermissionStatus(status);

      if (status === 'granted' && loadingState !== 'success') {
        await loadSongs();
      } else if (status !== 'granted') {
        setLoadingState('idle');
      }
    });

    return cleanup;
  }, [loadSongs, loadingState, setPermissionStatus]);

  const handleRefresh = useCallback(async () => {
    await checkAndRequestPermissions();
  }, [checkAndRequestPermissions]);

  const renderSongItem = useCallback(
    ({ item }: { item: Song }) => (
      <SongListItem song={item} />
    ),
    []
  );

  const keyExtractor = useCallback((item: Song) => item.id, []);

  if (permissionStatus === 'denied' || permissionStatus === 'blocked') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Songs</Text>
        <PermissionDeniedView
          status={permissionStatus}
          onRequestPermission={checkAndRequestPermissions}
        />
      </SafeAreaView>
    );
  }

  if (loadingState === 'loading' || loadingState === 'idle') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Songs</Text>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
          <Text style={styles.loadingText}>Loading songs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingState === 'empty') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Songs</Text>
        <View style={styles.centerContainer}>
          <Ionicons name="musical-notes" size={64} color={Colors.dark.textTertiary} />
          <Text style={styles.emptyTitle}>No Songs Found</Text>
          <Text style={styles.emptyText}>
            Your music library appears to be empty. Add some music to your device to see it here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingState === 'error') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Songs</Text>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.dark.error} />
          <Text style={styles.errorTitle}>Something Went Wrong</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Songs</Text>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshing={false}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}

function SongListItem({ song }: { song: Song }) {
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.songItem,
        pressed && styles.songItemPressed,
      ]}
    >
      <View style={styles.songIconContainer}>
        <Ionicons name="musical-note" size={24} color={Colors.dark.textSecondary} />
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
      <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.dark.text,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
  },
  emptyTitle: {
    marginTop: Spacing.lg,
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  emptyText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorTitle: {
    marginTop: Spacing.lg,
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  errorText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.lg,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  listContent: {
    paddingBottom: 100,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  songItemPressed: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.sm,
  },
  songIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  songTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  songArtist: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  songDuration: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textTertiary,
  },
});
