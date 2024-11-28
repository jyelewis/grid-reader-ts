import { imageOffsetsForGrid } from "./utilities/imageOffsetsForGrid";

export const CELL_OFFSETS = imageOffsetsForGrid({
  xOffsets: [46, 166, 286, 412, 532, 652, 778, 898, 1018],
  yOffsets: [432, 552, 672, 798, 918, 1038, 1164, 1284, 1404],
  width: 116,
  height: 117,
});

export const HINT_OFFSETS = imageOffsetsForGrid({
  xOffsets: [11, 48, 90],
  yOffsets: [12, 47, 88],
  width: 20,
  height: 20,
});
