import { currentUser } from "@clerk/nextjs/server";

import { ShortenForm } from "@/components/ShortenForm";
import { ShortenLists } from "@/components/ShortenLists";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="relative">
      <section id="hero" className="relative w-full py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 p-4">
          <h1 className="max-w-2xl text-center text-4xl font-bold sm:text-5xl">
            Shorten your long URL as eazy as{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Copy and Paste
            </span>
          </h1>
          <ShortenForm user={user?.id ?? null} />
        </div>
      </section>
      <ShortenLists user={user?.id ?? null} />
    </main>
  );
}
