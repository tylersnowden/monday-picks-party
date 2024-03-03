import type * as Party from "partykit/server";

import type { MineField } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  poll: MineField | undefined;

  async onStart() {
    this.poll = await this.room.storage.get<MineField>("poll");
  }

  async savePoll() {
    if (this.poll) {
      await this.room.storage.put<MineField>("poll", this.poll);
    }
  }

  async onMessage(message: string) {
    if (!this.poll) return;

    const event = JSON.parse(message);
    if (event.type === "vote") {
      this.poll.votes![event.option] += 1;
      this.room.broadcast(JSON.stringify(this.poll));
      this.savePoll();
    }
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const poll = (await req.json()) as MineField;
      this.poll = { ...poll, votes: poll.options.map(() => 0) };
      this.savePoll();
    }

    if (this.poll) {
      return new Response(JSON.stringify(this.poll), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }
}

Server satisfies Party.Worker;
