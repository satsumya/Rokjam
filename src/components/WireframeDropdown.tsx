import { useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { WireframeField } from './Wireframe';
import { ui } from '../theme/colors';

export type DropdownOption = {
  value: string;
  label: string;
};

const fieldStyle = {
  borderWidth: 1,
  borderColor: ui.border,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 12,
  backgroundColor: ui.surface,
} as const;

function WebSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}) {
  return (
  // Native HTML <select> — true OS dropdown menu, not an inline accordion.
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        width: '100%',
        appearance: 'auto',
        WebkitAppearance: 'menulist',
        fontSize: 16,
        color: ui.text,
        cursor: 'pointer',
        ...fieldStyle,
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function NativeDropdownMenu({
  visible,
  options,
  value,
  anchorTop,
  anchorLeft,
  anchorWidth,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: DropdownOption[];
  value: string;
  anchorTop: number;
  anchorLeft: number;
  anchorWidth: number;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.menuBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.menuList,
            {
              top: anchorTop + 4,
              left: anchorLeft,
              width: anchorWidth,
            },
          ]}
        >
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                style={[
                  styles.menuItem,
                  index > 0 ? styles.menuItemBorder : null,
                  option.value === value ? styles.menuItemSelected : null,
                ]}
              >
                <Text style={option.value === value ? styles.menuItemTextSelected : undefined}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function WireframeDropdown({
  label,
  value,
  options,
  onChange,
  customValue,
  onCustomChange,
  customPlaceholder,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  customPlaceholder?: string;
}) {
  const triggerRef = useRef<View>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, left: 0, width: 0 });
  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? value;

  const openMenu = () => {
    triggerRef.current?.measureInWindow((left, top, width, height) => {
      setMenuAnchor({ top: top + height, left, width });
      setMenuOpen(true);
    });
  };

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: '600', fontSize: 14 }}>{label}</Text>

      {Platform.OS === 'web' ? (
        <WebSelect value={value} options={options} onChange={onChange} />
      ) : (
        <>
          <Pressable
            ref={triggerRef}
            onPress={openMenu}
            accessibilityRole="button"
            style={{
              ...fieldStyle,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: ui.text }}>{displayLabel}</Text>
            <Text style={{ color: ui.textMuted }}>▾</Text>
          </Pressable>
          <NativeDropdownMenu
            visible={menuOpen}
            options={options}
            value={value}
            anchorTop={menuAnchor.top}
            anchorLeft={menuAnchor.left}
            anchorWidth={menuAnchor.width}
            onSelect={onChange}
            onClose={() => setMenuOpen(false)}
          />
        </>
      )}

      {onCustomChange ? (
        <WireframeField
          label="Custom"
          value={customValue ?? ''}
          onChangeText={onCustomChange}
          placeholder={customPlaceholder ?? 'Type a custom value'}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuList: {
    position: 'absolute',
    maxHeight: 240,
    borderWidth: 1,
    borderColor: ui.border,
    borderRadius: 8,
    backgroundColor: ui.surface,
    overflow: 'hidden',
    shadowColor: ui.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: ui.surface,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
  },
  menuItemSelected: {
    backgroundColor: ui.surfaceMuted,
  },
  menuItemTextSelected: {
    fontWeight: '700',
  },
});
