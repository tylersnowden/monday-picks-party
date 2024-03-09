import { MineField } from "./games/minefield/types";

export type GameObject = {
    title: string;
    type: string;
    game: MineField;
};