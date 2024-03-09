export type MineField = {
  size: number; // Always Square,
  cells: Cell[];
  status: "playing" | "won" | "lost";
};

export type Cell = {
  x: number;
  y: number;
  value: number;
  revealed: boolean;
  flagged: boolean;
};