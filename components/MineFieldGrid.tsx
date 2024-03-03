"use client";

import Cell from "@/components/Cell";
import { Cell as CellType } from "@/app/types";

export default function MineFieldGrid({
  cells,
  cell,
  setCell,
}: {
  cells: CellType[];
  cell: CellType | null;
  setCell: (cell: CellType) => void;
}) {

    return (
        <div className="grid grid-cols-10 gap-1">
        {cells.map((c, i) => (
            <Cell
                key={i}
                x={c.x}
                y={c.y}
                value={c.value}
                revealed={c.revealed}
                flagged={c.flagged}
                onClick={() => setCell(c)}
            />
        ))}
        </div>
    );
}