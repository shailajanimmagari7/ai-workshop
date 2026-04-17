# Phase 2: Device Access & Music Discovery

## Overview

Phase 2 implements media permission handling and music discovery, enabling the app to access the device's music library on both iOS and Android.

## Goals

- Request and handle media library permissions consistently on both platforms
- Discover all audio assets from the device using `expo-media-library`
- Normalize and model song metadata with a typed `Song` interface
- Provide clear UI for permission states (denied, blocked)

---

## 1. Permission Service

### 1.1 Permission Request

**File:** `services/permissionService.ts`

- Use `MediaLibrary.requestPermissionsAsync()` from `expo-media-library`
- Identical behavior on iOS and Android
- Map all permission states:
  - `granted` → proceed to music discovery
  - `denied` → show permission denied UI
  - `blocked` → show permission denied UI with "Open Settings" CTA
  - `undetermined` → trigger permission request

### 1.2 Permission State Re-check

- Listen to `AppState` changes
- Re-check permission state when app returns to foreground
- Update store state on permission changes

### 1.3 Store Integration

**File:** `stores/usePlayerStore.ts`

- Store `permissionStatus` in `usePlayerStore`
- States: `'undetermined' | 'denied' | 'blocked' | 'granted'`

---

## 2. Permission Denied UI

### 2.1 Full-Screen Empty State

**File:** `components/PermissionDeniedView.tsx`

- Rendered when permission is `denied` or `blocked`
- Components:
  - Icon (e.g., lock or music note)
  - Explanation text describing why access is needed
  - Primary CTA button

### 2.2 CTA Behavior

- `denied` → "Grant Access" → triggers `requestPermissionsAsync()` again
- `blocked` → "Open Settings" → calls `Linking.openSettings()` to open system settings

### 2.3 Visual Design

- Follows dark theme tokens from `constants/theme.ts`
- Centered layout, readable typography
- No hardcoded colors or spacing values

---

## 3. Music Discovery Service

### 3.1 Asset Fetching

**File:** `services/musicService.ts`

- Use `MediaLibrary.getAssetsAsync({ mediaType: MediaLibrary.MediaType.audio })`
- Paginate using `after` cursor until `hasNextPage` is false
- Never assume all assets fit in one API call

### 3.2 URI Resolution

- For each asset, call `MediaLibrary.getAssetInfoAsync(asset)` to retrieve `localUri`
- `localUri` is a `file://` path required by `expo-av` playback
- Raw asset URI (`ph://`) cannot be used directly

### 3.3 Filtering

- Skip assets under 30 seconds (voice memos, ringtones, notification sounds)

### 3.4 Metadata Normalization

- Missing `title` → fall back to filename (strip path and extension)
- Missing `artist` → fall back to `"Unknown Artist"`
- Missing `album` → fall back to `"Unknown Album"`
- Missing `duration` → fall back to `0`

### 3.5 Deduplication

- Deduplicate by `localUri` to avoid duplicate songs

### 3.6 Return Type

- Returns typed `Song[]` array

---

## 4. Data Modeling

### 4.1 Song Type

**File:** `types/Song.ts`

```ts
type Song = {
  id: string;        // asset.id from expo-media-library
  title: string;
  artist: string;
  album: string;
  duration: number;  // milliseconds
  uri: string;       // localUri (file://) — safe for expo-av playback
  artwork?: string;  // asset URI for artwork, optional
};
```

### 4.2 Design Rules

- `uri` is always a `file://` path by the time it reaches the store
- `ph://` → `localUri` conversion happens inside `musicService.ts`, never downstream
- All downstream code imports from `types/Song.ts`
- No local type redefinitions allowed

---

## 5. Error Handling

### 5.1 Error Categories

- `permission_denied` → permission denied or blocked
- `asset_unavailable` → asset not found or URI invalid
- `unknown` → catch-all for unexpected errors

### 5.2 Error Logging

- Log errors to console in development
- Surface meaningful messages in UI for each category

---

## 6. File Structure

```
services/
  permissionService.ts   # Permission request and state management
  musicService.ts         # Asset discovery and normalization

types/
  Song.ts                 # Song type definition

components/
  PermissionDeniedView.tsx  # Permission denied full-screen UI

stores/
  usePlayerStore.ts        # Updated with permissionStatus
```

---

## 7. Dependencies

- `expo-media-library` — media library access and permissions
- `expo-linking` — open system settings (for blocked permissions)
- `expo-app-state` — re-check permissions on foreground

---

## 8. Cross-Platform Notes

- All permission handling uses `MediaLibrary.requestPermissionsAsync()` — works identically on iOS and Android
- No platform branching required for permission logic
- `Linking.openSettings()` works on both platforms
- `expo-media-library` handles iOS sandboxing and Android media store internally
