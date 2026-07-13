/**
 * Loadable font assets for `useFonts` (see app/_layout.tsx). The keys must match
 * the family strings in `fontFamilies` (src/theme/typography.ts). Regular and
 * bold are loaded for both families — Fira Sans (headings) and Saira (body).
 */
import { FiraSans_400Regular, FiraSans_700Bold } from '@expo-google-fonts/fira-sans';
import { Saira_400Regular, Saira_700Bold } from '@expo-google-fonts/saira';

export const fontMap = {
  FiraSans_400Regular,
  FiraSans_700Bold,
  Saira_400Regular,
  Saira_700Bold,
} as const;
