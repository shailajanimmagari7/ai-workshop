import { useEffect, useState, useCallback, useMemo } from 'react';
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
import { SearchBar } from '@/components/SearchBar';
import { SortPicker, SortOption } from '@/components/SortPicker';
import { SongListItem } from '@/components/SongListItem';
import type { Song } from '@/types/Song';

type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export default function SongsScreen() {
  const permissionStatus = usePlayerStore((state) => state.permissionStatus);
  const setPermissionStatus = usePlayerStore((state) => state.setPermissionStatus);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('az');

  const loadSongs = useCallback(async () => {
    setLoadingState('loading');
    setErrorMessage('');

    const { songs: discoveredSongs, error } = await discoverSongs();

    if (error) {
      setLoadingState('error');
      setErrorMessage(error.message);
      setAllSongs([]);
      return;
    }

    if (discoveredSongs.length === 0) {
      setLoadingState('empty');
      setAllSongs([]);
      return;
    }

    setAllSongs(discoveredSongs);
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

  const handleSongPress = useCallback(
    (song: Song, index: number, songs: Song[]) => {
      setQueue(songs, index);
    },
    [setQueue]
  );

  const filteredAndSortedSongs = useMemo(() => {
    let result = [...allSongs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    return result;
  }, [allSongs, searchQuery, sortOption]);

  const displayedSongs = filteredAndSortedSongs;

  const renderSongItem = useCallback(
    ({ item, index }: { item: Song; index: number }) => (
      <SongListItem
        song={item}
        onPress={() => handleSongPress(item, index, displayedSongs)}
      />
    ),
    [handleSongPress, displayedSongs]
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
      <View style={styles.header}>
        <Text style={styles.title}>Songs</Text>
        <View style={styles.headerControls}>
          <SortPicker value={sortOption} onChange={setSortOption} />
        </View>
      </View>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FlatList
        data={displayedSongs}
        renderItem={renderSongItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshing={false}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptySearchContainer}>
              <Text style={styles.emptySearchText}>No songs match your search</Text>
            </View>
          ) : null
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.dark.text,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptySearchContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
