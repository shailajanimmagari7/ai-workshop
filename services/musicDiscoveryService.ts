import * as MediaLibrary from 'expo-media-library';
import type { Song } from '@/types/Song';

const MIN_DURATION_MS = 30000;

export type MusicDiscoveryError = {
  type: 'asset_unavailable' | 'unknown';
  message: string;
};

function getFilenameFromUri(uri: string): string {
  const parts = uri.split('/');
  const filename = parts[parts.length - 1] || '';
  return filename.replace(/\.[^/.]+$/, '');
}

async function fetchAllAssets(): Promise<MediaLibrary.Asset[]> {
  const assets: MediaLibrary.Asset[] = [];
  let hasNextPage = true;
  let after: string | undefined = undefined;

  while (hasNextPage) {
    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 100,
      after,
    });

    assets.push(...result.assets);
    hasNextPage = result.hasNextPage;
    after = result.endCursor;
  }

  return assets;
}

interface AssetWithMetadata extends MediaLibrary.Asset {
  artist?: string;
  album?: string;
}

async function fetchSongFromAsset(asset: MediaLibrary.Asset): Promise<Song | null> {
  try {
    const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
    const localUri = assetInfo.localUri;
    if (!localUri) {
      return null;
    }

    const assetWithMetadata = assetInfo as AssetWithMetadata;
    const title = assetInfo.filename
      ? getFilenameFromUri(assetInfo.filename)
      : getFilenameFromUri(localUri);
    const artist = assetWithMetadata.artist || 'Unknown Artist';
    const album = assetWithMetadata.album || 'Unknown Album';
    const duration = assetInfo.duration || 0;

    return {
      id: asset.id,
      title,
      artist,
      album,
      duration,
      uri: localUri,
    };
  } catch {
    return null;
  }
}

export async function discoverSongs(): Promise<{ songs: Song[]; error?: MusicDiscoveryError }> {
  try {
    const assets = await fetchAllAssets();

    const songMap = new Map<string, Song>();

    for (const asset of assets) {
      if ((asset.duration || 0) < MIN_DURATION_MS) {
        continue;
      }

      const song = await fetchSongFromAsset(asset);
      if (!song) {
        continue;
      }

      if (songMap.has(song.uri)) {
        continue;
      }

      songMap.set(song.uri, song);
    }

    const songs = Array.from(songMap.values());
    return { songs };
  } catch (error) {
    console.error('[MusicService] discoverSongs error:', error);
    return {
      songs: [],
      error: {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Failed to discover songs',
      },
    };
  }
}
