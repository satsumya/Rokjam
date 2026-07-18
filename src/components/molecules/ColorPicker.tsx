import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '../atoms/Text';
import { TextField } from '../atoms/TextField';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';
import {
  hexToHsv,
  hueToHex,
  hsvToHex,
  normalizeHex,
  type HsvColor,
} from '../../utils/color';

const SV_HEIGHT = 128;
const HUE_HEIGHT = 22;
const THUMB = 18;

const HUE_SPECTRUM = [
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FF0000',
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const parsed = hexToHsv(value) ?? { h: 120, s: 0.65, v: 0.75 };
  const [hsv, setHsv] = useState<HsvColor>(parsed);
  const [hexDraft, setHexDraft] = useState(normalizeHex(value) ?? hsvToHex(parsed.h, parsed.s, parsed.v));
  const [svWidth, setSvWidth] = useState(0);
  const [hueWidth, setHueWidth] = useState(0);

  const hsvRef = useRef(hsv);
  const onChangeRef = useRef(onChange);
  hsvRef.current = hsv;
  onChangeRef.current = onChange;

  useEffect(() => {
    const next = hexToHsv(value);
    if (!next) return;
    setHsv(next);
    setHexDraft(normalizeHex(value) ?? hsvToHex(next.h, next.s, next.v));
  }, [value]);

  const commit = (next: HsvColor) => {
    setHsv(next);
    const hex = hsvToHex(next.h, next.s, next.v);
    setHexDraft(hex);
    onChangeRef.current(hex);
  };

  const pureHue = useMemo(() => hueToHex(hsv.h), [hsv.h]);
  const selected = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv]);

  const svPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const width = svWidth;
          if (width <= 0) return;
          const { locationX, locationY } = event.nativeEvent;
          commit({
            ...hsvRef.current,
            s: clamp01(locationX / width),
            v: clamp01(1 - locationY / SV_HEIGHT),
          });
        },
        onPanResponderMove: (event) => {
          const width = svWidth;
          if (width <= 0) return;
          const { locationX, locationY } = event.nativeEvent;
          commit({
            ...hsvRef.current,
            s: clamp01(locationX / width),
            v: clamp01(1 - locationY / SV_HEIGHT),
          });
        },
      }),
    [svWidth],
  );

  const huePan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const width = hueWidth;
          if (width <= 0) return;
          commit({
            ...hsvRef.current,
            h: clamp01(event.nativeEvent.locationX / width) * 360,
          });
        },
        onPanResponderMove: (event) => {
          const width = hueWidth;
          if (width <= 0) return;
          commit({
            ...hsvRef.current,
            h: clamp01(event.nativeEvent.locationX / width) * 360,
          });
        },
      }),
    [hueWidth],
  );

  const onSvLayout = (event: LayoutChangeEvent) => {
    setSvWidth(event.nativeEvent.layout.width);
  };

  const onHueLayout = (event: LayoutChangeEvent) => {
    setHueWidth(event.nativeEvent.layout.width);
  };

  const handleHexChange = (text: string) => {
    setHexDraft(text);
    const normalized = normalizeHex(text);
    if (!normalized) return;
    const next = hexToHsv(normalized);
    if (!next) return;
    setHsv(next);
    onChange(normalized);
  };

  const svThumbLeft = svWidth > 0 ? hsv.s * svWidth - THUMB / 2 : 0;
  const svThumbTop = SV_HEIGHT * (1 - hsv.v) - THUMB / 2;
  const hueThumbLeft = hueWidth > 0 ? (hsv.h / 360) * hueWidth - THUMB / 2 : 0;

  return (
    <View style={{ gap: space[8] }}>
      <Text variant="body" weight="bold">
        Custom colour
      </Text>

      <View
        onLayout={onSvLayout}
        {...svPan.panHandlers}
        style={{
          height: SV_HEIGHT,
          borderRadius: 8,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: ui.border,
        }}
      >
        <LinearGradient
          colors={['#FFFFFF', pureHue]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', '#000000']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: svThumbLeft,
            top: svThumbTop,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            backgroundColor: selected,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </View>

      <View
        onLayout={onHueLayout}
        {...huePan.panHandlers}
        style={{
          height: HUE_HEIGHT,
          borderRadius: HUE_HEIGHT / 2,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: ui.border,
          justifyContent: 'center',
        }}
      >
        <LinearGradient
          colors={[...HUE_SPECTRUM]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: hueThumbLeft,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            backgroundColor: pureHue,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space[8] }}>
        <View style={{ flex: 1 }}>
          <TextField label="Hex" value={hexDraft} onChangeText={handleHexChange} placeholder="#RRGGBB" />
        </View>
        <View
          accessibilityLabel="Selected colour preview"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: ui.border,
            backgroundColor: selected,
            marginBottom: 1,
          }}
        />
      </View>
    </View>
  );
}
