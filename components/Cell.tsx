"use client";

import { useRef, useState } from "react";

export default function Cell({
  x,
  y,
  value,
  revealed,
  flagged,
}: {
  x: number;
  y: number;
  value: number;
  revealed: boolean;
  flagged: boolean;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`cell ${revealed ? "revealed" : ""} ${
        flagged ? "flagged" : ""
      }`}
      onClick={() => {}}
      // On Right Click, toggle flag
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {revealed && value !== 0 && value !== 9 ? value : ""}
      {revealed && value === 9 ? "💣" : ""}
      {!revealed && flagged ? "🚩" : ""}
      {!revealed && !flagged && hover ? "❔" : ""}
    </div>
  );
}