import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';
import { AppState, AppStateStatus } from 'react-native';

export type PermissionStatus = 'undetermined' | 'denied' | 'blocked' | 'granted';

export async function requestPermissions(): Promise<PermissionStatus> {
  const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

  if (status === 'granted') {
    return 'granted';
  }

  if (status === 'denied') {
    return canAskAgain ? 'denied' : 'blocked';
  }

  return 'undetermined';
}

export async function getPermissionStatus(): Promise<PermissionStatus> {
  const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();

  if (status === 'granted') {
    return 'granted';
  }

  if (status === 'denied') {
    return canAskAgain ? 'denied' : 'blocked';
  }

  return 'undetermined';
}

export async function openSettings(): Promise<void> {
  await Linking.openSettings();
}

export function createPermissionListener(
  onForeground: () => Promise<void>
): () => void {
  let lastState = AppState.currentState;

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (lastState.match(/inactive|background/) && nextAppState === 'active') {
      await onForeground();
    }
    lastState = nextAppState;
  };

  const subscription = AppState.addEventListener('change', handleAppStateChange);
  return () => subscription.remove();
}
