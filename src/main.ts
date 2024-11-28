import { COLOR_BLACK, COLOR_SELECTED_YELLOW, Image } from "./utilities/Image";
import { HINT_OFFSETS, CELL_OFFSETS } from "./constants";
import { loadTValues } from "./utilities/loadTValues";

async function main() {
  const gridPath = process.argv[2] || "./resources/grids/1/grid.png";
  const grid = await Image.fromFile(gridPath);

  const tValues = await loadTValues();

  const readCell = async (
    cell: Image,
  ): Promise<{ value: number } | { hints: number[] }> => {
    // first search for any t-value images that match against our cell
    const filteredCell = cell.onlyKeepColor(COLOR_BLACK);
    const matches = Array.from(tValues.entries())
      .map(([tValue, tImage]) => ({
        tValue: tValue,
        diff: filteredCell.compareToImage(tImage),
      }))
      .sort((a, b) => a.diff - b.diff);

    const bestMatch = matches[0];

    // if we don't match something confidently, search for hints instead
    if (bestMatch.diff > 80) {
      // use the full resolution cell, and don't cull to black
      // these hints are so small they get aliased into grey which we don't want to filter out
      const fullCellWithoutBackground = cell.removeColor(COLOR_SELECTED_YELLOW);

      return {
        hints: Array.from(HINT_OFFSETS.entries())
          .filter(([, rect]) => fullCellWithoutBackground.hasDataInRegion(rect))
          .map(([hintIndex]) => hintIndex + 1), // 0 indexed :(
      };
    }

    return { value: bestMatch.tValue };
  };

  let counter = 0;
  for (const position of CELL_OFFSETS.values()) {
    const cell = grid.getSubImage(position);
    const cellValue = await readCell(cell);

    if ("hints" in cellValue) {
      process.stdout.write(`[${cellValue.hints.length}] `);
    } else {
      process.stdout.write(` ${cellValue.value}  `);
    }

    counter++;
    if (counter % 9 === 0) {
      process.stdout.write("\n");
    }
  }
}

main().catch(console.error);
