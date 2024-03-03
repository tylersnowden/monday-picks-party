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
    // Create Cells and Set Mines
    for (let i = 0; i < 100; i++) {
      cells.push({
        x: i % 10,
        y: Math.floor(i / 10),
        value: (Math.floor(Math.random() * 10) == 9) ? 9 : 0,
        revealed: false,
        flagged: false,
      } as CellType);
    }
    // Determine the number of mines around each cell
    cells.forEach((cell) => {
      let count = 0;
      if (cell.value === 9) return;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const x = cell.x + i;
          const y = cell.y + j;

          if (x < 0 || x >= 10 || y < 0 || y >= 10) continue;

          const neighbor = cells.find((c) => c.x === x && c.y === y);
          if (neighbor?.value === 9) {
            count++;
          }
        }
      }

      cell.value = count;
    });
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
