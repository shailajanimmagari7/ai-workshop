import { create } from 'zustand';
import { Audio, AVPlaybackStatus, InterruptionModeIOS } from 'expo-av';
import type { Song } from '@/types/Song';
import type { PermissionStatus } from '@/services/permissionService';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  permissionStatus: PermissionStatus;
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
  position: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  originalQueue: Song[];
  sound: Audio.Sound | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  setPermissionStatus: (status: PermissionStatus) => void;
  initializeAudio: () => Promise<void>;
  play: (song?: Song) => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setQueue: (songs: Song[], startIndex?: number) => Promise<void>;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  unload: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  permissionStatus: 'undetermined',
  currentSong: null,
  isPlaying: false,
  queue: [],
  queueIndex: 0,
  position: 0,
  duration: 0,
  repeatMode: 'off',
  isShuffled: false,
  originalQueue: [],
  sound: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  setPermissionStatus: (status) => set({ permissionStatus: status }),

  initializeAudio: async () => {
    if (get().isInitialized) return;
    
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
    });
    
    set({ isInitialized: true });
  },

  play: async (song?: Song) => {
    const state = get();
    let { sound: currentSound, currentSong, queue, queueIndex } = state;

    if (song && song.uri !== currentSong?.uri) {
      if (currentSound) {
        await currentSound.unloadAsync();
        await currentSound.loadAsync({ uri: song.uri });
        await currentSound.playAsync();
      } else {
        const newSound = new Audio.Sound();
        newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            const { isPlaying, positionMillis, durationMillis } = status;
            set({
              isPlaying,
              position: positionMillis,
              duration: durationMillis || 0,
            });

            if (status.didJustFinish) {
              handleTrackEnd();
            }
          }
        });
        await newSound.unloadAsync();
        await newSound.loadAsync({ uri: song.uri });
        await newSound.playAsync();
        set({ sound: newSound });
        currentSound = newSound;
      }
      const songIndex = queue.findIndex((s) => s.id === song.id);
      set({ currentSong: song, queueIndex: songIndex >= 0 ? songIndex : queueIndex, error: null });
      return;
    }

    if (currentSound && currentSong) {
      if (state.position > 0) {
        await currentSound.playAsync();
      } else {
        await currentSound.unloadAsync();
        await currentSound.loadAsync({ uri: currentSong.uri });
        await currentSound.playAsync();
      }
      set({ isPlaying: true, error: null });
    }
  },

  pause: async () => {
    const { sound } = get();
    if (sound) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  togglePlayPause: async () => {
    const { isPlaying, play, pause, currentSong } = get();
    if (!currentSong) return;

    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  },

  next: async () => {
    const { queue, queueIndex, repeatMode, sound } = get();
    if (queue.length === 0) return;

    let nextIndex: number;
    const atLastSong = queueIndex >= queue.length - 1;

    if (repeatMode === 'one') {
      nextIndex = queueIndex;
    } else if (atLastSong) {
      nextIndex = repeatMode === 'all' ? 0 : queue.length - 1;
    } else {
      nextIndex = queueIndex + 1;
    }

    if (repeatMode === 'off' && nextIndex >= queue.length) return;

    const nextSong = queue[nextIndex];
    if (sound && nextSong) {
      await sound.unloadAsync();
      await sound.loadAsync({ uri: nextSong.uri });
      await sound.playAsync();
      set({ currentSong: nextSong, queueIndex: nextIndex, isPlaying: true, position: 0, error: null });
    }
  },

  previous: async () => {
    const { queue, queueIndex, position, sound } = get();
    if (queue.length === 0) return;

    if (position > 3000) {
      if (sound) {
        await sound.setPositionAsync(0);
        set({ position: 0 });
      }
      return;
    }

    const prevIndex = queueIndex > 0 ? queueIndex - 1 : 0;
    const prevSong = queue[prevIndex];
    if (sound && prevSong) {
      await sound.unloadAsync();
      await sound.loadAsync({ uri: prevSong.uri });
      await sound.playAsync();
      set({ currentSong: prevSong, queueIndex: prevIndex, isPlaying: true, position: 0, error: null });
    }
  },

  seek: async (position: number) => {
    const { sound } = get();
    if (sound) {
      await sound.setPositionAsync(position);
      set({ position });
    }
  },

  setQueue: async (songs: Song[], startIndex = 0) => {
    const { isShuffled, originalQueue, sound } = get();

    let newQueue = [...songs];
    let newOriginalQueue = [...songs];

    if (isShuffled) {
      const currentSong = songs[startIndex];
      const remainingSongs = songs.filter((_, i) => i !== startIndex);
      newQueue = [currentSong, ...shuffleArray(remainingSongs)];
    }

    if (newQueue.length === 0) return;

    const songToPlay = newQueue[startIndex];
    set({
      queue: newQueue,
      originalQueue: newOriginalQueue,
      queueIndex: startIndex,
      isLoading: true,
    });

    if (!sound) {
      const newSound = new Audio.Sound();
      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          const { isPlaying, positionMillis, durationMillis } = status;
          set({
            isPlaying,
            position: positionMillis,
            duration: durationMillis || 0,
            isLoading: false,
          });

          if (status.didJustFinish) {
            handleTrackEnd();
          }
        }
      });
      await newSound.unloadAsync();
      await newSound.loadAsync({ uri: songToPlay.uri });
      await newSound.playAsync();
      set({ sound: newSound });
    } else {
      await sound.unloadAsync();
      await sound.loadAsync({ uri: songToPlay.uri });
      await sound.playAsync();
    }

    set({ currentSong: songToPlay, isPlaying: true, isLoading: false, error: null });
  },

  toggleRepeat: () => {
    const { repeatMode } = get();
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    set({ repeatMode: modes[nextIndex] });
  },

  toggleShuffle: () => {
    const { isShuffled, queue, originalQueue, currentSong, queueIndex } = get();
    const newShuffled = !isShuffled;

    if (newShuffled) {
      const current = queue[queueIndex];
      const remainingSongs = queue.filter((_, i) => i !== queueIndex);
      const shuffled = shuffleArray(remainingSongs);
      const newQueue = current ? [current, ...shuffled] : shuffled;
      const newIndex = current ? 0 : 0;
      set({ isShuffled: newShuffled, queue: newQueue, queueIndex: newIndex });
    } else {
      const current = currentSong;
      const newQueue = [...originalQueue];
      const newIndex = current ? newQueue.findIndex((s) => s.id === current.id) : 0;
      set({ isShuffled: newShuffled, queue: newQueue, queueIndex: Math.max(0, newIndex) });
    }
  },

  unload: async () => {
    const { sound } = get();
    if (sound) {
      await sound.unloadAsync();
      set({ sound: null, currentSong: null, isPlaying: false, position: 0, duration: 0 });
    }
  },
}));

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function handleTrackEnd() {
  const { repeatMode, next, queue, queueIndex } = usePlayerStore.getState();

  if (repeatMode === 'one') {
    const { sound, currentSong } = usePlayerStore.getState();
    if (sound && currentSong) {
      sound.setPositionAsync(0).then(() => sound.playAsync());
    }
    return;
  }

  if (queueIndex < queue.length - 1) {
    next();
  } else if (repeatMode === 'all') {
    const { setQueue } = usePlayerStore.getState();
    setQueue(queue, 0);
  }
}
