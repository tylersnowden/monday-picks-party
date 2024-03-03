"use client";

import { useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";

export default function SessionMaker() {
  const [title, setTitle] = useState("");

  const canSubmit = title.length > 0

  return (
    <>
      <Input
        placeholder="Session title"
        type="text"
        name="title"
        className={"text-2xl font-bold"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            newOptionRef.current?.focus();
          }
        }}
      />
      <Button type="submit" disabled={!canSubmit}>
        Create Session
      </Button>
    </>
  );
}
