import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

export type StatusType = 'error' | 'warning' | 'info' | 'success';

interface StatusCardProps {
  type: StatusType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap: Record<StatusType, keyof typeof Ionicons.glyphMap> = {
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
  success: 'checkmark-circle',
};

const colorMap: Record<StatusType, string> = {
  error: Colors.dark.error,
  warning: '#FFA000',
  info: Colors.dark.accent,
  success: Colors.dark.success,
};

export const StatusCard = memo(function StatusCard({
  type,
  title,
  message,
  actionLabel,
  onAction,
}: StatusCardProps) {
  const iconName = iconMap[type];
  const iconColor = colorMap[type];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={64} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onAction}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  button: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.lg,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.dark.text,
  },
});
