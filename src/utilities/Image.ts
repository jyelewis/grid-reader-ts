import sharp from "sharp";

export const COLOR_BLACK = Uint8Array.from([0, 0, 0, 255]);
export const COLOR_TRANSPARENT = Uint8Array.from([0, 0, 0, 0]);
export const COLOR_SELECTED_YELLOW = Uint8Array.from([255, 218, 0, 255]);

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Image {
  static async fromFile(filePath: string): Promise<Image> {
    const { data, info } = await sharp(filePath)
      .unflatten()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return new Image(Uint8Array.from(data), info.width, info.height);
  }

  constructor(
    public readonly data: Uint8Array,
    public readonly width: number,
    public readonly height: number,
  ) {}

  async toFile(filePath: string): Promise<void> {
    const image = sharp(Buffer.from(this.data), {
      raw: {
        width: this.width,
        height: this.height,
        channels: 4,
      },
    });

    await image.toFile(filePath);
  }

  getPixel(x: number, y: number): Uint8Array {
    const idx = (y * this.width + x) * 4;
    return this.data.slice(idx, idx + 4);
  }

  getSubImage({ x, y, width, height }: Rect): Image {
    // TODO: use views to avoid all these copies
    const data = new Uint8Array(width * height * 4);

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const idx = (j * width + i) * 4;
        const pixel = this.getPixel(x + i, y + j);
        data.set(pixel, idx);
      }
    }

    return new Image(data, width, height);
  }

  compareToImage(image: Image): number {
    let differingValues = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (Math.abs(this.data[i] - image.data[i]) > 15) {
        differingValues++;
      }
    }

    return differingValues;
  }

  hasDataInRegion(region: Rect): boolean {
    for (let y = region.y; y < region.y + region.height; y++) {
      for (let x = region.x; x < region.x + region.width; x++) {
        const pixel = this.getPixel(x, y);

        if (pixel[3] !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  onlyKeepColor(color: Uint8Array): Image {
    const data = new Uint8Array(this.data);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pixel = this.getPixel(x, y);

        const outputColor = colorIsSame(pixel, color, 200)
          ? color
          : COLOR_TRANSPARENT;

        data.set(outputColor, (y * this.width + x) * 4);
      }
    }

    return new Image(data, this.width, this.height);
  }

  removeColor(color: Uint8Array): Image {
    const data = new Uint8Array(this.data);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pixel = this.getPixel(x, y);
        if (colorIsSame(pixel, color, 10)) {
          data.set(COLOR_TRANSPARENT, (y * this.width + x) * 4);
        }
      }
    }

    return new Image(data, this.width, this.height);
  }
}

function colorIsSame(
  colorA: Uint8Array,
  colorB: Uint8Array,
  tolerance: number,
): boolean {
  return (
    Math.abs(colorA[0] - colorB[0]) +
      Math.abs(colorA[1] - colorB[1]) +
      Math.abs(colorA[2] - colorB[2]) +
      Math.abs(colorA[3] - colorB[3]) <
    tolerance
  );
}
