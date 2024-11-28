import { Image } from "./Image";
import fs from "fs/promises";

export async function loadTValues(): Promise<Map<number, Image>> {
  const tValues = new Map<number, Image>();

  const files = await fs.readdir("./resources/t-values");
  for (const file of files) {
    const image = await Image.fromFile(`./resources/t-values/${file}`);
    const tValue = parseInt(file.split(".")[0], 10);
    tValues.set(tValue, image);
  }

  return tValues;
}
