import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '../atoms/Text';
import { TextField } from '../atoms/TextField';
import { ui } from '../../theme/colors';
import { colorPickerGeometry } from '../../theme/colorPicker';
import { space } from '../../theme/spacing';
import {
  hexToHsv,
  hueToHex,
  hsvToHex,
  normalizeHex,
  type HsvColor,
} from '../../utils/color';

/** Pure HSV spectrum stops (physics), not brand order. */
const HUE_SPECTRUM = [
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FF0000',
] as const;

const { svHeight: SV_HEIGHT, hueHeight: HUE_HEIGHT, thumb: THUMB, previewSize: PREVIEW } =
  colorPickerGeometry;

function ColorPickerRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SvCanvas({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SvThumb({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HueSlider({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HueThumb({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HexPreviewRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HexFieldSlot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ColorPreviewSwatch({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

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
    <ColorPickerRoot style={{ gap: space[8] }}>
      <Text variant="body" weight="bold">
        Custom colour
      </Text>

      <SvCanvas
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
        <SvThumb
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: svThumbLeft,
            top: svThumbTop,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            borderWidth: 2,
            borderColor: ui.surface,
            backgroundColor: selected,
            shadowColor: ui.shadow,
            shadowOpacity: 0.25,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </SvCanvas>

      <HueSlider
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
        <HueThumb
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: hueThumbLeft,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            borderWidth: 2,
            borderColor: ui.surface,
            backgroundColor: pureHue,
            shadowColor: ui.shadow,
            shadowOpacity: 0.25,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </HueSlider>

      <HexPreviewRow style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space[8] }}>
        <HexFieldSlot style={{ flex: 1, minWidth: 0 }}>
          <TextField label="Hex" value={hexDraft} onChangeText={handleHexChange} placeholder="#RRGGBB" />
        </HexFieldSlot>
        <ColorPreviewSwatch
          accessibilityLabel="Selected colour preview"
          style={{
            width: PREVIEW,
            height: PREVIEW,
            flexShrink: 0,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: ui.border,
            backgroundColor: selected,
            marginBottom: 1,
          }}
        />
      </HexPreviewRow>
    </ColorPickerRoot>
  );
}
