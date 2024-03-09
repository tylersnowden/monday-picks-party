import { notFound } from "next/navigation";
import { PARTYKIT_URL, PARTYKIT_HOST } from "@/app/env";
import type { GameObject } from "@/app/types";
import GameManager from "@/components/GameManager";
import SharedSpace from "@/app/cursor/shared-space";
import CursorsContextProvider from "@/app/cursor/cursors-context";

export default async function GamePage({
  params,
}: {
  params: { session_id: string };
}) {
  const sessionId = params.session_id;

  const req = await fetch(`${PARTYKIT_URL}/party/${sessionId}`, {
    method: "GET",
    next: {
      revalidate: 0
    }
  });

  if (!req.ok) {
    if (req.status === 404) {
      notFound();
    } else {
      throw new Error("Something went wrong.");
    }
  }

  const gameObject = (await req.json()) as GameObject;

  return (
    <>
      <CursorsContextProvider room={sessionId} host={PARTYKIT_HOST}>
        <div className="flex flex-col space-y-4">
          <GameManager sessionId={sessionId} gameObject={gameObject} />
        </div>

        <SharedSpace />
      </CursorsContextProvider>
    </>
  );
}
