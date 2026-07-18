import { View, type ViewProps } from 'react-native';

function LevelDotSwatch({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Small square swatch representing a difficulty level's colour. */
export function LevelDot({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <LevelDotSwatch style={{ width: size, height: size, borderRadius: 2, backgroundColor: color }} />
  );
}
