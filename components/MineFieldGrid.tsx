"use client";

import { PARTYKIT_URL, PARTYKIT_HOST } from "@/app/env";
import { MineField, Cell as CellType } from "@/app/types";
import Cell from "@/components/Cell";
import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";
import Button from "./Button";

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
      if (message.status) {
        minefield.status = message.status;
      }
    }
  });

  const sendCell = (cell: CellType) => {
    socket.send(JSON.stringify({ type: "cell", cell: cell }));
  };

  const sendReset = (minefield: MineField) => {
    socket.send(JSON.stringify({ type: "minefield", minefield: minefield }));
  };

  const setCell = (cell: CellType) => {
    let changed = false;
    // in cells, find the cell with the same x and y and replace it with the new cell
    const newCells = cells.map((c) => {
      if (c.x === cell.x && c.y === cell.y) {
        if (c.revealed) {
          return c;
        }
        changed = true;
        return cell;
      }
      return c;
    });
    if (changed) {
      setCells(newCells);
      sendCell(cell);
    }
  }

  const resetMineField = async () => {
    const cells = minefield.cells.map((cell) => {
      return {
        ...cell,
        revealed: false,
        flagged: false,
      };
    });
    setCells(cells);

    const updatedMinefield = {
      ...minefield,
      cells: cells,
      status: "playing",
    } as MineField;

    sendReset(updatedMinefield);
  }

  return (
    <>
      <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{minefield.title}</h1>
          <div className="text-right">
              <form action={resetMineField}>
              <Button type="submit">
                  Reset
              </Button>
              </form>
          </div>
      </div>
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
              rightClickHandler={(c) => setCell(c)}
          />
      ))}
      </div>
      <div className="text-center capitalize">Status: {minefield.status}</div>
      </>
  );
}