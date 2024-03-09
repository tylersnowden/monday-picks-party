import { MineField, Cell as CellType } from "./types";

export function generateMineField(): MineField 
{
    let cells: CellType[] = [];
    // Create Cells and Set Mines
    for (let i = 0; i < 100; i++) {
      cells.push({
        x: i % 10,
        y: Math.floor(i / 10),
        value: (Math.floor(Math.random() * 10) == 9) ? 9 : 0,
        revealed: false,
        flagged: false,
      } as CellType);
    }
    // Determine the number of mines around each cell
    cells.forEach((cell) => {
      let count = 0;
      if (cell.value === 9) return;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const x = cell.x + i;
          const y = cell.y + j;

          if (x < 0 || x >= 10 || y < 0 || y >= 10) continue;

          const neighbor = cells.find((c) => c.x === x && c.y === y);
          if (neighbor?.value === 9) {
            count++;
          }
        }
      }

      cell.value = count;
    });
    return {
      size: 10,
      cells: cells,
      status: "playing",
    } as MineField;

}