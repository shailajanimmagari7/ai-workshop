import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

export type SortOption = 'az' | 'za' | 'artist' | 'duration';

interface SortPickerProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'az', label: 'A–Z', icon: 'text' },
  { value: 'za', label: 'Z–A', icon: 'text' },
  { value: 'artist', label: 'By Artist', icon: 'person' },
  { value: 'duration', label: 'By Duration', icon: 'time' },
];

export function SortPicker({ value, onChange }: SortPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = sortOptions.find((opt) => opt.value === value);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="funnel" size={18} color={Colors.dark.textSecondary} />
        <Text style={styles.triggerText}>{currentOption?.label}</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  value === option.value && styles.menuItemSelected,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={value === option.value ? Colors.dark.accent : Colors.dark.textSecondary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    value === option.value && styles.menuItemTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {value === option.value && (
                  <Ionicons name="checkmark" size={20} color={Colors.dark.accent} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.md,
  },
  triggerPressed: {
    opacity: 0.7,
  },
  triggerText: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginLeft: Spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    width: '80%',
    maxWidth: 300,
  },
  menuTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  menuItemPressed: {
    backgroundColor: Colors.dark.surface,
  },
  menuItemSelected: {
    backgroundColor: Colors.dark.surface,
  },
  menuItemText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.dark.text,
    marginLeft: Spacing.md,
  },
  menuItemTextSelected: {
    color: Colors.dark.accent,
    fontWeight: '500',
  },
});
