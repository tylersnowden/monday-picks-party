"use client";

import { PARTYKIT_HOST } from "@/app/env";
import { MineField, Cell as CellType } from "@/app/types";
import Cell from "@/components/Cell";
import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";

export default function MineFieldGrid({
  id,
  minefield,
}: {
  id: string,
  minefield: MineField
}) {
  const [cells, setCells] = useState<CellType[]>(minefield.cells ?? []);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: id,
    onMessage(event) {
      const message = JSON.parse(event.data) as MineField;
      if (message.cells) {
        setCells(message.cells);
      }
    }
  });

  const sendCell = (cell: CellType) => {
    socket.send(JSON.stringify({ type: "cell", cell: cell }));
  };

  const setCell = (cell: CellType) => {
    // in cells, find the cell with the same x and y and replace it with the new cell
    const newCells = cells.map((c) => {
      if (c.x === cell.x && c.y === cell.y) {
        return cell;
      }
      return c;
    });
    setCells(newCells);
    sendCell(cell);
  }

  // prevent double clicking
  /*useEffect(() => {
    let saved = localStorage?.getItem("minefield:" + id);
    if (minefield === null && saved !== null) {
      setCell(JSON.parse(saved));
    } else if (minefield !== null && saved === null) {
      localStorage?.setItem("minefield:" + id, JSON.stringify(minefield));
    }
  }, [id, minefield]);*/

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
                clickHandler={(c) => setCell(c)}
                rightClickHandler={() => {}}
            />
        ))}
        </div>
    );
}