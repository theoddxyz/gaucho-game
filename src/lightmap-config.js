// lightmap-config.js — Shared constants between bake script and runtime
// Coverage area: world-space rectangle that the lightmap texture covers
export const LM_CENTER_X = 0;      // center X (world units)
export const LM_CENTER_Z = -30;    // center Z (village is around z=-30 to -70)
export const LM_COVER_W  = 500;    // width  (X axis, world units)
export const LM_COVER_H  = 500;    // height (Z axis, world units)
export const LM_SIZE     = 1024;   // texture resolution (pixels)

// Convert world (x, z) → UV [0..1]
export function worldToUV(wx, wz) {
  return [
    (wx - LM_CENTER_X) / LM_COVER_W + 0.5,
    (wz - LM_CENTER_Z) / LM_COVER_H + 0.5,
  ];
}
