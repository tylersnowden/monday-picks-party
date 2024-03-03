import Button from "@/components/Button";
import SessionMaker from "@/components/SessionMaker";
import Balloon from "@/components/Balloon";
import { MineField, Cell as CellType } from "@/app/types";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import Input from "@/components/Input";
import Cell from "@/components/Cell";

const randomId = () => Math.random().toString(36).substring(2, 10);

export default function Home() {
  async function createMineField(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString() ?? "Anonymous minefield";

    const id = randomId();
    let cells = [];
    for (let i = 0; i < 100; i++) {
      cells.push({
        x: i % 10,
        y: Math.floor(i / 10),
        value: 0,
        revealed: false,
        flagged: false,
      } as CellType);
    }
    const minefield: MineField = {
      title,
      size: 10,
      cells: cells,
    };

    await fetch(`${PARTYKIT_URL}/party/${id}`, {
      method: "POST",
      body: JSON.stringify(minefield),
      headers: {
        "Content-Type": "application/json"
      }
    });

    redirect(`/${id}`);
  }

  return (
    <>
      <form action={createMineField}>
        <div className="flex flex-col space-y-6">
          <SessionMaker />
        </div>
      </form>
      <Balloon />
    </>
  );
}
