import { Rect } from "./Image";

export function imageOffsetsForGrid({
  xOffsets,
  yOffsets,
  width,
  height,
}: {
  xOffsets: number[];
  yOffsets: number[];
  width: number;
  height: number;
}): Map<number, Rect> {
  const offsets = new Map<number, Rect>();

  for (let y = 0; y < yOffsets.length; y++) {
    for (let x = 0; x < xOffsets.length; x++) {
      offsets.set(y * xOffsets.length + x, {
        x: xOffsets[x],
        y: yOffsets[y],
        width,
        height,
      });
    }
  }

  return offsets;
}
