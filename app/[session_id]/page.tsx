import { notFound } from "next/navigation";
import { PARTYKIT_URL, PARTYKIT_HOST } from "@/app/env";
import type { MineField } from "@/app/games/minefield/types";
import MineFieldGame from "@/app/games/minefield/MineFieldGame";
import SharedSpace from "@/app/cursor/shared-space";
import CursorsContextProvider from "@/app/cursor/cursors-context";

export default async function MineFieldPage({
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

  const minefield = (await req.json()) as MineField;

  return (
    <>
      <CursorsContextProvider room={sessionId} host={PARTYKIT_HOST}>
        <div className="flex flex-col space-y-4">
          <MineFieldGame id={sessionId} minefield={minefield} />
        </div>

        <SharedSpace />
      </CursorsContextProvider>
    </>
  );
}
