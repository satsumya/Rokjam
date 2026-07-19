import { View, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { LevelDot } from '../atoms/LevelDot';
import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export type PieSlice = {
  label: string;
  value: number;
  color: string;
};

function PieChartRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function PieLegend({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function PieLegendRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeSlice(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

/** Simple coloured pie with a label legend — values are climb counts. */
export function PieChart({
  slices,
  size = 168,
}: {
  slices: PieSlice[];
  size?: number;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (!slices.length || total <= 0) {
    return (
      <Text variant="body" color={ui.textMuted}>
        No difficulty data in this timeframe.
      </Text>
    );
  }

  const radius = size / 2;
  const cx = radius;
  const cy = radius;
  let angle = 0;

  const paths =
    slices.length === 1
      ? [
          {
            key: slices[0].label,
            color: slices[0].color,
            d: describeSlice(cx, cy, radius, 0, 359.999),
          },
        ]
      : slices.map((slice) => {
          const sweep = (slice.value / total) * 360;
          const startAngle = angle;
          const endAngle = angle + sweep;
          angle = endAngle;
          return {
            key: `${slice.label}-${slice.color}`,
            color: slice.color,
            d: describeSlice(cx, cy, radius, startAngle, endAngle),
          };
        });

  return (
    <PieChartRoot style={{ gap: space[12], alignItems: 'flex-start' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((path) => (
          <Path
            key={path.key}
            d={path.d}
            fill={path.color}
            stroke={ui.surface}
            strokeWidth={2}
          />
        ))}
      </Svg>
      <PieLegend style={{ gap: space[6], width: '100%' }}>
        {slices.map((slice) => (
          <PieLegendRow
            key={`${slice.label}-${slice.color}`}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space[8] }}
          >
            <LevelDot color={slice.color} size={12} />
            <Text variant="bodySmall" style={{ flex: 1, minWidth: 0 }} numberOfLines={1}>
              {slice.label}
            </Text>
            <Text variant="bodySmall" color={ui.textMuted}>
              {slice.value}
            </Text>
          </PieLegendRow>
        ))}
      </PieLegend>
    </PieChartRoot>
  );
}
