import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <header className="relative w-full max-w-5xl px-6 py-6 flex justify-between items-center">
      <Link
        to="/"
        className="text-xl font-black tracking-tight hover:tracking-widest transition-all duration-200"
      >
        Copas
      </Link>
      <a
        href="https://github.com/vanirvan/copas"
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        <Github />
      </a>
    </header>
  );
}
