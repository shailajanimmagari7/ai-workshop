# AGENTS.md

## Project

Expo (SDK 54) music player targeting iOS and Android. Uses expo-router file-based routing and Zustand for state.

## Commands

```bash
npm install          # install deps
npm run start        # start dev server (expo start)
npm run lint         # lint (expo lint)
npx expo prebuild    # regenerate native folders after app.json plugin changes
```

## Architecture

- **Entry:** `expo-router/entry` (set in `package.json` main field)
- **Routes:** `app/` directory — expo-router file-based routing
- **Components:** `components/` — reusable UI
- **Hooks:** `hooks/` — custom hooks
- **Theme:** `constants/theme.ts` — Colors (light/dark) and Fonts
- **Path alias:** `@/*` maps to project root

## Conventions

- **Dark theme only** — all color tokens in `constants/theme.ts`
- **No hardcoded hex values** — components consume tokens from theme
- **Audio:** `expo-av` for playback, `expo-media-library` for device library access
- **Persistence:** `expo-file-system` + JSON file at `documentDirectory/library-store.json`
- **State:** Zustand stores (per spec; store files not yet present)
- **Testing:** none configured yet

## Critical Constraints (from spec)

- Requires **Expo Dev Client** — NOT Expo Go. `expo-media-library` and background audio need a dev build.
- All native config lives in `app.json` — no manual edits to `Info.plist` or `AndroidManifest.xml`
- `localUri` (file://) required for `expo-av` playback — raw asset URI won't work
- No lock screen controls (expo-av limitation)
- All async operations must handle errors with explicit categories: `permission_denied`, `asset_unavailable`, `playback_failed`, `store_corrupt`, `unknown`

## Spec Reference

Detailed implementation plan at `docs/implementation.md` — 4 phases, cross-platform constraints, and accepted limitations.

## Spec File Rules (SDD)

- All specs MUST be created under `/specs` directory
- Each phase must have its own folder:
  - `specs/phase-1/`
  - `specs/phase-2/`
  - `specs/phase-3/`
  - `specs/phase-4/`
- Spec file must be named exactly: `spec.md`
- Plan and tasks files must follow:
  - `plan.md`
  - `tasks.md`
- No spec files are allowed in the root directory
- Always create missing folders before writing spec files

## Agent Behavior Rules

- NEVER decide spec file location automatically — always follow `/specs/phase-x/`
- When generating specs, ALWAYS:
  1. Create correct folder structure
  2. Write to `spec.md`
- DO NOT implement code when asked to create a spec
- Follow SDD pipeline strictly:
  - Spec → Clarify → Plan → Tasks → Implement