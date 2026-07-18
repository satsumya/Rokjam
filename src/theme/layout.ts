import { space } from './spacing';

/**
 * Layout constraints for screens and content columns.
 * Product UI must remain usable down to {@link layout.minViewportWidth}.
 */
export const layout = {
  /** Max width for product screen content (not utility / scenario pages). */
  contentMaxWidth: 640,
  /** Max width for centered dialogs (`Modal`). */
  modalMaxWidth: 480,
  /** Narrowest phone width we support without clipping or margin overflow. */
  minViewportWidth: 320,
  /** Use compact gutters at or below this width. */
  compactBreakpoint: 360,
} as const;

/** Page gutter for Screen / Modal / BottomSheet chrome — tighter on very narrow phones. */
export function pageGutter(viewportWidth: number) {
  return viewportWidth <= layout.compactBreakpoint ? space[16] : space[24];
}
