# Phase 1: Foundation & Project Setup

## Overview

**Objective:** Establish the base structure, environment, and shared foundations that all future phases build on — for both iOS and Android.

**Target Platforms:** iOS and Android

---

## Project Structure

### Current Layout (from create-expo-app)

```
app/           → expo-router routes (file-based routing)
components/    → reusable UI components
constants/     → theme tokens (Colors, Fonts)
hooks/         → custom React hooks
```

### Additional Folders to Create

```
stores/        → Zustand store definitions
types/         → shared TypeScript interfaces
```

### Path Alias

`@/*` maps to project root (already configured in `tsconfig.json`)

---

## 1. Design System Foundation

### Update `constants/theme.ts`

- Extend with full dark theme color tokens (background, surface, text, accent colors)
- No hardcoded hex values outside theme
- All components consume tokens from theme

### Files to Create

| File | Description |
|------|-------------|
| `constants/theme.ts` | Update existing — full dark theme colors, fonts, spacing |

### Rules

- Dark theme only
- No screen should hardcode a colour, size, or spacing value
- All components consume tokens from `constants/theme.ts`

---

## 2. Navigation Shell

### Routes to Create/Rename

| Route | Type | Screen | File |
|-------|------|--------|------|
| `/songs` | Tab | Song List (placeholder) | `app/(tabs)/songs.tsx` |
| `/library` | Tab | Library (placeholder) | `app/(tabs)/library.tsx` |
| `/now-playing` | Modal | Now Playing (placeholder) | `app/modal.tsx` (exists) |

### Tasks

- [ ] Rename `app/(tabs)/index.tsx` → `app/(tabs)/songs.tsx`
- [ ] Rename `app/(tabs)/explore.tsx` → `app/(tabs)/library.tsx`
- [ ] Rename `app/modal.tsx` → `app/now-playing.tsx`
- [ ] Update `app/(tabs)/_layout.tsx` with tab config (Songs, Library)
- [ ] Update root `app/_layout.tsx` modal reference
- [ ] Create placeholder content for each screen

### Tab Navigator

- Bottom tabs: `Songs` and `Library`
- Now Playing opens as modal from anywhere

---

## 3. Store Scaffolding

### Stores to Create

| Store | Location | Purpose |
|-------|----------|---------|
| `usePlayerStore` | `stores/usePlayerStore.ts` | Playback state, current track, queue |
| `useLibraryStore` | `stores/useLibraryStore.ts` | Liked songs, albums, persistence |

### Initial Shape

```ts
// stores/usePlayerStore.ts
interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  queueIndex: number;
}

// stores/useLibraryStore.ts
interface LibraryState {
  likedSongIds: string[];
  albums: Album[];
}
```

### Rules

- Both stores wired into the app but not yet functional
- Stores use Zustand
- Stores initialized on app startup

---

## 4. Native Platform Configuration

### Configuration via `app.json` only

**Android:**
- [ ] Add `expo-media-library` plugin with `READ_EXTERNAL_STORAGE` and `READ_MEDIA_AUDIO` permissions
- [ ] Set `android.useNextNotificationsApi: true`

**iOS:**
- [ ] Add `NSAppleMusicUsageDescription` via `infoPlist`
- [ ] Add `UIBackgroundModes: ["audio"]` via `infoPlist`

**Both platforms:**
- [ ] Add `expo-av` plugin with `microphonePermission: false`

### Note

All plugin configuration lives in `app.json` — regenerate native folders with `npx expo prebuild` when changed.

---

## 5. Mini Player Placeholder

- Render in root `app/_layout.tsx`
- Visible on all tab screens, hidden when modal is open
- Shows nothing when queue is empty
- Wrapped in `SafeAreaView`

---

## 6. Dependencies (Install)

| Package | Purpose |
|---------|---------|
| `zustand` | State management |
| `expo-media-library` | Media library access |
| `expo-av` | Audio playback |
| `expo-file-system` | File persistence |

---

## Acceptance Criteria

1. Project builds successfully for both iOS and Android
2. Dark theme colors defined in `constants/theme.ts`
3. Bottom tab navigation between `Songs` and `Library` tabs
4. Now Playing modal opens from anywhere
5. Mini player placeholder renders in root layout
6. Both Zustand stores initialized and accessible
7. `app.json` contains all required platform configurations
8. Routes: `/songs`, `/library`, `/now-playing` all accessible
