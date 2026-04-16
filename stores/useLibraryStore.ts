import { create } from 'zustand';
import type { Album } from '@/types/Album';

interface LibraryState {
  likedSongIds: string[];
  albums: Album[];
}

export const useLibraryStore = create<LibraryState>(() => ({
  likedSongIds: [],
  albums: [],
}));
