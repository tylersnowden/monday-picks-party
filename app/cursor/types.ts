export type Cursor = {
    // replicating the default connection fields to avoid
    // having to do an extra deserializeAttachment
    id: string;
    uri: string;
  
    // country is set upon connection
    country: string | null;
  
    // cursor fields are only set on first message
    x?: number;
    y?: number;
    pointer?: "mouse" | "touch";
    lastUpdate?: number;
};
  
export type UpdateCursorMessage = {
    type: "update";
    id: string; // websocket.id
} & Cursor;
  
export type SyncCursorMessage = {
    type: "sync";
    cursors: { [id: string]: Cursor };
};
  
export type RemoveCursorMessage = {
    type: "remove";
    id: string; // websocket.id
};