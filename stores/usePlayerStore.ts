import { create } from 'zustand';
import type { Song } from '@/types/Song';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
  position: number;
  duration: number;
}

export const usePlayerStore = create<PlayerState>(() => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  queueIndex: 0,
  position: 0,
  duration: 0,
}));
