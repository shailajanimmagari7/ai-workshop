import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.placeholder}>
        <Text style={styles.subtitle}>Your Library</Text>
        <Text style={styles.text}>Liked songs and albums will appear here once Phase 4 is implemented.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    paddingHorizontal: 16,
    paddingTop: 16,
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
});
