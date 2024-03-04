"use client";

import { PARTYKIT_URL, PARTYKIT_HOST } from "@/app/env";
import { MineField, Cell as CellType } from "@/app/types";
import Cell from "@/components/Cell";
import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";
import Button from "./Button";
import { generateMineField } from "@/app/utils";
import toastr from "toastr";

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
        if (message.status != minefield.status && message.status === "lost") {
          toastr.error("You stepped on a mine! You Lost!");
        } else if (message.status != minefield.status && minefield.status === "won") {
          toastr.success("You won!");
        }
        minefield.status = message.status;
      }
    }
  });

  const sendCell = (cell: CellType) => {
    socket.send(JSON.stringify({ type: "cell", cell: cell }));
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
    let newMineField = generateMineField(minefield.title);
    socket.send(JSON.stringify({ type: "minefield", minefield: newMineField }));
  };

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