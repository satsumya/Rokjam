import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatFlowMapVersionStatus } from '../utils/flowMapVersionFormat';
import { ui } from '../theme/colors';

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
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
          paddingVertical: 4,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text style={{ fontSize: 12, color: ui.textMuted }}>{open ? '▾' : '▸'}</Text>
        <Text style={{ fontSize: 12, color: ui.textMuted, fontWeight: '600' }}>Version info</Text>
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
              <Text style={{ fontSize: 12, fontWeight: '600', color: ui.textLabel }}>{item.label}</Text>
              <Text style={{ fontSize: 11, color: ui.textSubtle, lineHeight: 15 }}>
                {formatFlowMapVersionStatus(item.version, item.updatedAt)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
