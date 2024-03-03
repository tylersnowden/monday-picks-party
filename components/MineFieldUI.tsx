"use client";

import { PARTYKIT_HOST } from "@/app/env";
import { MineField, Cell } from "@/app/types";
import MineFieldGrid from "@/components/MineFieldGrid";
import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";

export default function MineFieldUI({
  id,
  minefield
}: {
  id: string;
  minefield: MineField;
}) {
  const [cells, setCells] = useState<Cell[]>(minefield.cells ?? []);
  const [cell, setCell] = useState<Cell | null>(null);

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

  const sendCell = () => {
    if (cell === null) {
      socket.send(JSON.stringify({ type: "cell", x: 0, y: 0 }));
      setCell({ x: 0, y: 0, value: 0, revealed: false, flagged: false });
    }
  };

  // prevent double clicking
  useEffect(() => {
    let saved = localStorage?.getItem("minefield:" + id);
    if (cell === null && saved !== null) {
      setCell(JSON.parse(saved));
    } else if (cell !== null && saved === null) {
      localStorage?.setItem("minefield:" + id, JSON.stringify(cells));
    }
  }, [id, cells, cell]);

  return (
    <MineFieldGrid
      cells={cells}
      cell={cell}
      setCell={sendCell}
    />
  );
}
