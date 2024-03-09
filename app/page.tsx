import SessionMaker from "@/components/SessionMaker";
import Balloon from "@/components/Balloon";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import { generateMineField } from "./games/minefield/utils";

const randomId = () => Math.random().toString(36).substring(2, 10);

export default function Home() {
  async function createSession(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString() ?? "Anonymous";

    const id = randomId();
    let minefield = generateMineField();
    let gameObject = {
      title: title,
      game: minefield,
      type: "minefield",
    }

    await fetch(`${PARTYKIT_URL}/party/${id}`, {
      method: "POST",
      body: JSON.stringify(gameObject),
      headers: {
        "Content-Type": "application/json"
      }
    });

    redirect(`/${id}`);
  }

  return (
    <>
      <form action={createSession}>
        <div className="flex flex-col space-y-6">
          <SessionMaker />
        </div>
      </form>
      <Balloon />
    </>
  );
}
