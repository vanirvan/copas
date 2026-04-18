import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/features/landing-page/Navbar";
import { HeroSection } from "@/components/features/landing-page/HeroSection";
import { RecentLinksSection } from "@/components/features/landing-page/RecentLinksSection";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative min-h-screen flex flex-col gap-6 items-center overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-5xl px-6 flex-1 flex flex-col items-center">
        <HeroSection />
        <RecentLinksSection />
      </main>
    </div>
  );
}
