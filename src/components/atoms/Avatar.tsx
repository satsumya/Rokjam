import { Text as RNText, type TextProps } from 'react-native';

import { iconSizes, type IconSize } from '../../theme/icon';

/**
 * Member avatar. Today avatars are emoji "pet rocks", rendered here as text —
 * but sizing goes through the shared icon-size scale (`xs`–`xl`) so swapping to
 * SVG/image avatars later keeps identical dimensions across the app. Change the
 * rendering here once and every call site follows. `size` accepts an icon-size
 * token (preferred) or a raw pixel number as an escape hatch.
 *
 * Named `AvatarGlyph` so DevTools distinguishes it from RN `Text` / `AppText`.
 */
function AvatarGlyph({ style, ...rest }: TextProps) {
  return <RNText style={style} {...rest} />;
}

export function Avatar({
  emoji,
  size = 'md',
  style,
  ...rest
}: { emoji: string; size?: IconSize | number } & TextProps) {
  const px = typeof size === 'number' ? size : iconSizes[size];
  return (
    <AvatarGlyph style={[{ fontSize: px }, style]} {...rest}>
      {emoji}
    </AvatarGlyph>
  );
}
