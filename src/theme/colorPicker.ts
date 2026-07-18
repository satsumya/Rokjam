/**
 * Geometry for the level colour picker (SV panel, hue slider, thumbs, swatches).
 * Change here rather than hardcoding sizes in ColorPicker / LevelRow.
 */
export const colorPickerGeometry = {
  svHeight: 128,
  hueHeight: 22,
  thumb: 18,
  previewSize: 40,
  /** Unused-preset chips in the level colour sheet. */
  presetSwatch: 36,
  /** Inline colour chip on a level row. */
  rowSwatch: 24,
} as const;
