import { COLOR_BLACK, Image } from "./utilities/Image";
import { CELL_OFFSETS } from "./constants";

async function main() {
  const sourceGrid = await Image.fromFile("./resources/grids/source/grid.png");

  // mappings from t-value to position in the source grid
  const sourceNumbers = {
    1: 10,
    2: 2,
    3: 28,
    4: 0,
    5: 8,
    6: 7,
    7: 3,
    8: 26,
    9: 1,
  };

  // extract all the images, filter them, and write to disk
  await Promise.all(
    Object.entries(sourceNumbers).map(async ([tValue, position]) => {
      // extract & resize the cell image
      const cellImage = sourceGrid
        .getSubImage(CELL_OFFSETS.get(position)!)
        .onlyKeepColor(COLOR_BLACK);

      await cellImage.toFile(`./resources/t-values/${tValue}.png`);
    }),
  );

  console.log("Write source files");
}
main().catch(console.error);
