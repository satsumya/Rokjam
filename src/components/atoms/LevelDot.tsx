import { View } from 'react-native';

/** Small square swatch representing a difficulty level's colour. */
export function LevelDot({ color, size = 12 }: { color: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: 2, backgroundColor: color }} />;
}
