# Phase 3: Core Playback Experience

## Overview

Phase 3 delivers the complete music playing experience: browse, play, control, and search. This phase integrates the playback engine, Now Playing screen, Mini Player, and search/sort functionality.

## Goals

- Display song list with proper state handling
- Implement audio playback using `expo-av`
- Create Now Playing modal screen
- Add Mini Player component
- Implement search and sort functionality

---

## 1. Song List Screen

### 1.1 Implementation

**File:** `app/(tabs)/songs.tsx` (already updated in Phase 2)

### 1.2 States

- `loading` — ActivityIndicator with loading text
- `empty` — No songs found message with icon
- `permission_denied` — `PermissionDeniedView` component
- `error` — Error message with retry button
- `success` — FlatList with song items

### 1.3 Pull-to-Refresh

- Re-triggers full asset fetch and normalization
- Updates song list on refresh

---

## 2. Playback Engine

### 2.1 Audio Mode Configuration

**File:** `services/playbackService.ts`

Configure once on app startup:
```ts
Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
});
```

### 2.2 Audio.Sound Instance

- Lives in `usePlayerStore`
- Created on first play, reused for track changes via `sound.loadAsync(newSource)`
- Unload before loading new track: `sound.unloadAsync()`

### 2.3 Store Updates

**File:** `stores/usePlayerStore.ts`

Add playback state:
- `currentSong: Song | null`
- `isPlaying: boolean`
- `position: number` (milliseconds)
- `duration: number` (milliseconds)
- `queue: Song[]`
- `queueIndex: number`
- `repeatMode: 'off' | 'all' | 'one'`
- `isShuffled: boolean`

Add actions:
- `play(song?: Song)` — play specific song or resume
- `pause()` — pause current playback
- `next()` — play next song
- `previous()` — play previous song
- `seek(position: number)` — seek to position
- `setQueue(songs: Song[], startIndex?: number)` — set queue and optionally start playing
- `toggleRepeat()` — cycle through repeat modes
- `toggleShuffle()` — toggle shuffle mode

### 2.4 Playback Status Updates

Subscribe via `sound.setOnPlaybackStatusUpdate()`:
- Sync `position`, `duration`, `isPlaying`
- Auto-advance on track finish
- Handle track finish based on repeat mode

### 2.5 Queue Initialization Rule

Tapping a song loads the entire current filtered/sorted list into the queue, starting at the tapped index.

### 2.6 Audio Interruptions

- `shouldDuckAndroid: true` handles Android audio focus
- iOS interruptions handled automatically when `playsInSilentModeIOS` and `staysActiveInBackground` are set

### 2.7 Background Audio

- Enabled via `staysActiveInBackground: true`
- Requires `UIBackgroundModes: ["audio"]` in `app.json` (configured in Phase 1)
- Music continues when screen locks on both platforms

---

## 3. Now Playing Screen

### 3.1 Modal Route

**File:** `app/now-playing.tsx`

Opens as a modal from anywhere in the app.

### 3.2 Display Elements

- Artwork (or placeholder image)
- Song title
- Artist name
- Seek bar with draggable thumb
- Position label (current time)
- Duration label (total time)
- Play/Pause button
- Previous button
- Next button
- Repeat mode button
- Shuffle button

### 3.3 Seek Bar Behavior

- Updates position every second via `onPlaybackStatusUpdate`
- User can drag to seek
- Shows current position and total duration

### 3.4 Controls Binding

All controls bound to `usePlayerStore` actions.

---

## 4. Mini Player

### 4.1 Placement

**File:** `app/_layout.tsx`

Rendered in root layout, visible on all tab screens, hidden when Now Playing modal is open.

### 4.2 Display Elements

- Song title (truncated)
- Artist name (truncated)
- Play/Pause button

### 4.3 Interaction

- Tapping anywhere opens Now Playing modal
- Wrapped in `SafeAreaView` for iOS home indicator and Android navigation bar

### 4.4 Visibility Rules

- Shows nothing when queue is empty
- Hidden when Now Playing modal is open

---

## 5. Search & Sort

### 5.1 Search

**File:** `components/SearchBar.tsx`

- Filter by title and artist (case-insensitive)
- UI-only filtering of in-memory song array
- Clear button to reset search

### 5.2 Sort Options

**File:** `components/SortPicker.tsx`

- A–Z (alphabetical by title)
- Z–A (reverse alphabetical)
- By Artist
- By Duration

Sort state lives in local component state, not global store.

### 5.3 Integration

Search bar and sort picker displayed in Songs screen header.

---

## 6. Song List Item

### 6.1 Display

**File:** `components/SongListItem.tsx`

- Thumbnail/icon
- Song title
- Artist name
- Duration (formatted as mm:ss)
- Playing indicator if current song

### 6.2 Interaction

- Tap to play song (loads queue from current list)
- Long press for song options menu (Phase 4)

---

## 7. File Structure

```
services/
  playbackService.ts           # Audio mode configuration

components/
  SearchBar.tsx               # Search input component
  SortPicker.tsx              # Sort options picker
  SongListItem.tsx            # Song row component
  MiniPlayer.tsx               # Mini player component

stores/
  usePlayerStore.ts           # Updated with playback state and actions

app/
  now-playing.tsx             # Now Playing modal
```

---

## 8. Dependencies

- `expo-av` — audio playback (already installed)
- All dependencies from Phase 1 and Phase 2

---

## 9. Error Handling

### 9.1 Error Categories

- `playback_failed` — playback error (file not found, codec issue, etc.)
- Handle errors from `sound.loadAsync()` and `sound.playAsync()`

### 9.2 Error UI

Show error toast or alert for playback failures.

---

## 10. Cross-Platform Notes

- Background audio behavior is consistent on both platforms
- Audio mode configuration is identical on iOS and Android
- Seek bar and controls work identically on both platforms
