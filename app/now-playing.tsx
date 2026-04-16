import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function NowPlayingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Now Playing</Text>
      <View style={styles.placeholder}>
        <Text style={styles.subtitle}>Music Player</Text>
        <Text style={styles.text}>Now Playing will appear here once Phase 3 is implemented.</Text>
      </View>
      <Link href="/" dismissTo asChild>
        <Pressable style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 16,
  },
  closeText: {
    fontSize: 16,
    color: Colors.dark.accent,
  },
});
