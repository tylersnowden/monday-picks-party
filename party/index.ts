import type * as Party from "partykit/server";

import type { MineField, Cell } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  minefield: MineField | undefined;

  async onStart() {
    this.minefield = await this.room.storage.get<MineField>("minefield");
  }

  async saveMineField() {
    if (this.minefield) {
      await this.room.storage.put<MineField>("minefield", this.minefield);
    }
  }

  async onMessage(message: string) {
    if (!this.minefield) return;

    const event = JSON.parse(message);
    if (event.type === "cell") {
      const cell = event.cell as Cell;
      this.minefield.cells = this.minefield.cells.map((c) => {
        if (c.x === cell.x && c.y === cell.y) {
          return cell;
        }
        return c;
      });

      this.room.broadcast(JSON.stringify(this.minefield));
      this.saveMineField();
    }
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const minefield = (await req.json()) as MineField;
      this.minefield = minefield;
      this.saveMineField();
    }

    if (this.minefield) {
      return new Response(JSON.stringify(this.minefield), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
}

Server satisfies Party.Worker;
