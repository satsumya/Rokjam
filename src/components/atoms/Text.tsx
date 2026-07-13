import { Text as RNText, type TextProps } from 'react-native';

import { ui } from '../../theme/colors';
import { textStyle, type FontWeightName, type TextVariant } from '../../theme/typography';

/**
 * Text atom — the single source of truth for typography. Pass a `variant` (role)
 * from the type scale instead of hardcoding `fontSize`/`fontFamily`, e.g.
 * `<Text variant="h2">Sessions</Text>`. Every variant supports `weight`
 * (`regular` | `bold`); headings default to bold, body to regular. `color`
 * defaults to the primary text colour — pass a theme colour token to override.
 */
export function Text({
  variant = 'body',
  weight,
  color = ui.text,
  style,
  ...rest
}: { variant?: TextVariant; weight?: FontWeightName; color?: string } & TextProps) {
  return <RNText style={[textStyle(variant, weight), { color }, style]} {...rest} />;
}
