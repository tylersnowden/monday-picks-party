"use client";

import { useRef, useState } from "react";
import { Cell as CellType } from "@/app/games/minefield/types";

export default function Cell({
  x,
  y,
  value,
  revealed,
  flagged,
  clickHandler,
  rightClickHandler
}: {
  x: number;
  y: number;
  value: number;
  revealed: boolean;
  flagged: boolean;
  clickHandler: (cell: CellType) => void;
  rightClickHandler: (cell: CellType) => void;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`cell ${revealed ? "revealed" : ""} ${
        flagged ? "flagged" : ""
      }`}
      onClick={() => clickHandler({ x: x, y: y, revealed: true, flagged: false, value: value } as CellType)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (revealed) return;
        rightClickHandler({ x: x, y: y, revealed: false, flagged: !flagged, value: value } as CellType);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {revealed && value !== 9 ? value : ""}
      {revealed && value === 9 ? "💣" : ""}
      {!revealed && flagged ? "🚩" : ""}
      {!revealed && !flagged && hover ? "❓" : ""}
    </div>
  );
}