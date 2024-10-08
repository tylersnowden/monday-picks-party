import type * as Party from "partykit/server";

import type { Cursor, UpdateCursorMessage, SyncCursorMessage, RemoveCursorMessage } from "@/app/types";

type ConnectionWithCursor = Party.Connection & { cursor?: Cursor };

export default class CursorServer implements Party.Server {
    constructor(public party: Party.Party) {}
    options: Party.ServerOptions = {
      hibernate: true,
    };
  
    onConnect(
      websocket: Party.Connection,
      { request }: Party.ConnectionContext
    ): void | Promise<void> {
      const country = request.cf?.country ?? null;
  
      // Stash the country in the websocket attachment
      websocket.serializeAttachment({
        ...websocket.deserializeAttachment(),
        country: country,
      });
  
      console.log("[connect]", this.party.id, websocket.id, country);
  
      // On connect, send a "sync" message to the new connection
      // Pull the cursor from all websocket attachments
      let cursors: { [id: string]: Cursor } = {};
      for (const ws of this.party.getConnections()) {
        const id = ws.id;
        let cursor =
          (ws as ConnectionWithCursor).cursor ?? ws.deserializeAttachment();
        if (
          id !== websocket.id &&
          cursor !== null &&
          cursor.x !== undefined &&
          cursor.y !== undefined
        ) {
          cursors[id] = cursor;
        }
      }
  
      const msg = <SyncCursorMessage>{
        type: "sync",
        cursors: cursors,
      };
  
      websocket.send(JSON.stringify(msg));
    }
  
    onMessage(
      message: string,
      websocket: Party.Connection
    ): void | Promise<void> {
      const position = JSON.parse(message as string);
      const prevCursor = this.getCursor(websocket);
      const cursor = <Cursor>{
        id: websocket.id,
        x: position.x,
        y: position.y,
        pointer: position.pointer,
        country: prevCursor?.country,
        lastUpdate: Date.now(),
      };
  
      this.setCursor(websocket, cursor);
  
      const msg =
        position.x && position.y
          ? <UpdateCursorMessage>{
              type: "update",
              ...cursor,
              id: websocket.id,
            }
          : <RemoveCursorMessage>{
              type: "remove",
              id: websocket.id,
            };
  
      // Broadcast, excluding self
      this.party.broadcast(JSON.stringify(msg), [websocket.id]);
    }
  
    getCursor(connection: ConnectionWithCursor) {
      if (!connection.cursor) {
        connection.cursor = connection.deserializeAttachment();
      }
  
      return connection.cursor;
    }
  
    setCursor(connection: ConnectionWithCursor, cursor: Cursor) {
      let prevCursor = connection.cursor;
      connection.cursor = cursor;
  
      // throttle writing to attachment to once every 100ms
      if (
        !prevCursor ||
        !prevCursor.lastUpdate ||
        (cursor.lastUpdate && cursor.lastUpdate - prevCursor.lastUpdate > 100)
      ) {
        // Stash the cursor in the websocket attachment
        connection.serializeAttachment({
          ...cursor,
        });
      }
    }
  
    onClose(websocket: Party.Connection) {
      // Broadcast a "remove" message to all connections
      const msg = <RemoveCursorMessage>{
        type: "remove",
        id: websocket.id,
      };
  
      console.log(
        "[disconnect]",
        this.party.id,
        websocket.id,
        websocket.readyState
      );
  
      this.party.broadcast(JSON.stringify(msg), []);
    }
  }
  
  CursorServer satisfies Party.Worker;