import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { formatFlowMapVersionStatus } from '../../utils/flowMapVersionFormat';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';

export type FlowMapVersionAccordionItem = {
  label: string;
  version: string;
  updatedAt: string;
};

export function FlowMapVersionAccordion({ items }: { items: FlowMapVersionAccordionItem[] }) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 12 }}>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={open ? 'Hide version info' : 'Show version info'}
        style={(state) => [
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            alignSelf: 'flex-start',
            paddingVertical: 4,
            borderRadius: 4,
          },
          interactionStyle(state),
        ]}
      >
        <Icon name={open ? 'caretDown' : 'caretRight'} size="xs" color={ui.textMuted} />
        <Text variant="bodySmall" weight="bold" color={ui.textMuted}>
          Version info
        </Text>
      </Pressable>
      {open ? (
        <View
          style={{
            marginTop: 6,
            paddingLeft: 18,
            gap: 4,
          }}
        >
          {items.map((item) => (
            <View key={item.label}>
              <Text variant="bodySmall" weight="bold" color={ui.textLabel}>
                {item.label}
              </Text>
              <Text variant="bodySmall" color={ui.textSubtle}>
                {formatFlowMapVersionStatus(item.version, item.updatedAt)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
