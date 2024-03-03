import { notFound } from "next/navigation";
import { PARTYKIT_URL } from "@/app/env";
import type { MineField } from "@/app/types";
import MineFieldGrid from "@/components/MineFieldGrid";
import Balloon from "@/components/Balloon";
import Script from 'next/script'

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
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{minefield.title}</h1>
        <MineFieldGrid id={sessionId} minefield={minefield} />
      </div>

      <Balloon float />
      <Script src="https://cursor-party.tylersnowden.partykit.dev/cursors.js"></Script>
    </>
  );
}
