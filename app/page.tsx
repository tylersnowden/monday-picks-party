import Button from "@/components/Button";
import SessionMaker from "@/components/SessionMaker";
import Balloon from "@/components/Balloon";
import { MineField } from "@/app/types";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import Input from "@/components/Input";

const randomId = () => Math.random().toString(36).substring(2, 10);

export default function Home() {
  async function createMineField(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString() ?? "Anonymous poll";
    const options: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("option-") && value.toString().trim().length > 0) {
        options.push(value.toString());
      }
    }

    const id = randomId();
    const minefield: MineField = {
      title,
      size: 10,
      cells: [],
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
