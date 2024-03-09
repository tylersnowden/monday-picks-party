import type * as Party from "partykit/server";

import type { MineField, Cell } from "@/app/games/minefield/types";
import { GameObject } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameObject: GameObject | undefined;

  async onStart() {
    this.gameObject = await this.room.storage.get<GameObject>("gameObject");
  }

  async saveGameObject() {
    if (this.gameObject) {
      await this.room.storage.put<GameObject>("gameObject", this.gameObject);
    }
  }

  async onMessage(message: string) {
    if (!this.gameObject) return;

    let loss = false;
    const event = JSON.parse(message);
    if (event.type === "minefield") {
      this.gameObject.game = event.minefield;
    } else if (event.type === "cell") {
      const cell = event.cell as Cell;
      this.gameObject.game.cells = this.gameObject.game.cells.map((c) => {
        if (c.x === cell.x && c.y === cell.y) {
          if (cell.revealed && cell.value === 9) {
            loss = true;
          }
          return cell;
        }
        return c;
      });

      if (loss) {
        this.gameObject.game.status = "lost";
      } else {
        let win = true;
        this.gameObject.game.cells.forEach((c) => {
          if (c.value === 9 && !c.flagged) {
            win = false;
            return;
          }
        });
  
        if (win) {
          this.gameObject.game.status = "won";
        }
      }
    }

    this.room.broadcast(JSON.stringify(this.gameObject));
    this.saveGameObject();
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const game = (await req.json()) as GameObject;
      this.gameObject = game;
      this.saveGameObject();
    }

    if (this.gameObject) {
      return new Response(JSON.stringify(this.gameObject), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
}

Server satisfies Party.Worker;
