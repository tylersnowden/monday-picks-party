import SessionMaker from "@/components/SessionMaker";
import Balloon from "@/components/Balloon";
import { MineField, Cell as CellType } from "@/app/types";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import { generateMineField } from "./utils";

const randomId = () => Math.random().toString(36).substring(2, 10);

export default function Home() {
  async function createMineField(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString() ?? "Anonymous minefield";

    const id = randomId();
    let minefield = generateMineField(title);

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
