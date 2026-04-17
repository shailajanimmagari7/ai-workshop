import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { openSettings } from '@/services/permissionService';

interface PermissionDeniedViewProps {
  status: 'denied' | 'blocked';
  onRequestPermission: () => void;
}

export function PermissionDeniedView({ status, onRequestPermission }: PermissionDeniedViewProps) {
  const isBlocked = status === 'blocked';

  const handleCtaPress = async () => {
    if (isBlocked) {
      await openSettings();
    } else {
      onRequestPermission();
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name={isBlocked ? 'lock-closed' : 'musical-notes'}
        size={64}
        color={Colors.dark.textTertiary}
      />
      <Text style={styles.title}>
        {isBlocked ? 'Permission Required' : 'Music Access Needed'}
      </Text>
      <Text style={styles.description}>
        {isBlocked
          ? 'Music access was denied. Please open Settings to enable access to your music library.'
          : 'Grant access to your music library to browse and play your songs.'}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.ctaButton,
          pressed && styles.ctaButtonPressed,
        ]}
        onPress={handleCtaPress}
      >
        <Text style={styles.ctaText}>
          {isBlocked ? 'Open Settings' : 'Grant Access'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.lg,
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.dark.text,
  },
});
