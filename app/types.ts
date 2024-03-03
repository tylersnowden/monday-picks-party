export type MineField = {
  title: string;
  size: number; // Always Square,
  cells: Cell[];
};

export type Cell = {
  x: number;
  y: number;
  value: number;
  revealed: boolean;
  flagged: boolean;
};
