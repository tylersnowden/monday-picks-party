import { notFound } from "next/navigation";
import { PARTYKIT_URL, PARTYKIT_HOST } from "@/app/env";
import type { MineField } from "@/app/types";
import MineFieldGrid from "@/components/MineFieldGrid";
import Balloon from "@/components/Balloon";
import SharedSpace from "@/app/shared-space";
import Button from "@/components/Button";
import CursorsContextProvider from "@/app/cursors-context";

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

  async function resetMineField() {
    const cells = minefield.cells.map((cell) => {
      return {
        ...cell,
        revealed: false,
        flagged: false,
      };
    });

    const updatedMinefield = {
      ...minefield,
      cells: cells,
      status: "playing",
    };

    await fetch(`${PARTYKIT_URL}/party/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify(updatedMinefield),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  return (
    <>
      <CursorsContextProvider room={sessionId} host={PARTYKIT_HOST}>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{minefield.title}</h1>
            <div className="text-right">
              <Button>
                Reset
              </Button>
            </div>
          </div>
          <MineFieldGrid id={sessionId} minefield={minefield} />
        </div>
        <Balloon float />

        <SharedSpace />
      </CursorsContextProvider>
    </>
  );
}
