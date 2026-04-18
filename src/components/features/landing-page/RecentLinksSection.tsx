import { Button } from "#/components/ui/button";
import { Link2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RecentLink {
  title: string;
  url: string;
  short: string;
  createdAt: string;
}

export function RecentLinksSection() {
  const [links, setLinks] = useState<RecentLink[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (short: string) => {
    navigator.clipboard.writeText(short);
    toast.success("Link copied to clipboard");
    setCopiedLink(short);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  useEffect(() => {
    const loadLinks = () => {
      const stored = localStorage.getItem("copas_recent_links");
      if (stored) {
        setLinks(JSON.parse(stored));
      }
    };

    loadLinks();

    window.addEventListener("links_updated", loadLinks);
    window.addEventListener("storage", loadLinks); // Cross-tab support

    return () => {
      window.removeEventListener("links_updated", loadLinks);
      window.removeEventListener("storage", loadLinks);
    };
  }, []);

  if (links.length === 0) return null;

  return (
    <section className="py-24 w-full max-w-4xl">
      <div className="flex justify-between items-end mb-6 px-1">
        <div className="flex flex-col text-left">
          <h2 className="text-xl font-bold tracking-tight">Recent Links</h2>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Your latest shortened URLs
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {links.map((link, i) => (
          <div
            key={`${link.short}-${i}`}
            className="flex items-center justify-between bg-muted rounded p-4 sm:pl-6 sm:pr-4 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div className="flex items-center gap-4 flex-1 overflow-hidden pr-4">
              <div className="w-10 h-10 rounded-md bg-border/20 flex flex-col items-center justify-center shrink-0">
                <Link2
                  size={18}
                  className="text-foreground border border-border p-[3px] rounded shadow-sm bg-background"
                />
              </div>
              <div className="flex flex-col overflow-hidden whitespace-nowrap text-ellipsis text-left">
                <span className="font-bold text-foreground text-sm">
                  {link.title}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground truncate tracking-tight">
                  {link.url}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0">
              <div className="text-primary font-semibold text-[13px] hidden sm:flex bg-background px-4 py-2 border border-border/50 rounded-lg tracking-wide">
                {link.short}
              </div>
              <Button
                onClick={() => handleCopy(link.short)}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/10 hover:border-border/50 bg-background shadow-xs px-3 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
              >
                {copiedLink === link.short ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span className="hidden sm:inline">Link copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-foreground" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
