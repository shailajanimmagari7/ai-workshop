import { create } from 'zustand';
import type { Song } from '@/types/Song';
import type { PermissionStatus } from '@/services/permissionService';

interface PlayerState {
  permissionStatus: PermissionStatus;
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
  position: number;
  duration: number;
  setPermissionStatus: (status: PermissionStatus) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  permissionStatus: 'undetermined',
  currentSong: null,
  isPlaying: false,
  queue: [],
  queueIndex: 0,
  position: 0,
  duration: 0,
  setPermissionStatus: (status) => set({ permissionStatus: status }),
}));
