import { Link2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "#/components/ui/input-group";
import { Button } from "#/components/ui/button";
import { useState } from "react";
import { urlSchema } from "#/lib/validations/url-validation";
import { shortenUrl } from "#/actions/shorten";

export function HeroSection() {
  const host = import.meta.env.VITE_APP_URL || "copas.vanirvan.my.id";

  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    url: "",
    alias: "",
  });

  const [inputErrors, setInputErrors] = useState<{
    url: string[];
    alias: string[];
  }>({
    url: [],
    alias: [],
  });

  const onSubmit = async () => {
    if (inputs.url === "" && inputs.alias === "") return;

    const validate = urlSchema.safeParse(inputs);

    if (!validate.success) {
      const fieldErrors = validate.error.flatten().fieldErrors;
      setInputErrors({
        url: (fieldErrors.url as string[]) || [],
        alias: (fieldErrors.alias as string[]) || [],
      });
      return;
    }

    // Success - Clear errors and proceed
    setInputErrors({ url: [], alias: [] });
    setIsLoading(true);

    try {
      const result = await shortenUrl({ data: validate.data });

      // Store in localStorage
      const storageKey = "copas_recent_links";
      const existingLinks = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );

      const newEntry = {
        title: result.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0], // Simple domain title
        url: result.url,
        short: `${host}/${result.alias}`,
        createdAt: new Date().toISOString(),
      };

      const updatedLinks = [newEntry, ...existingLinks].slice(0, 10);
      localStorage.setItem(storageKey, JSON.stringify(updatedLinks));

      // Dispatch event to notify other components (like RecentLinksSection)
      window.dispatchEvent(new Event("links_updated"));

      // Clear inputs on success
      setInputs({ url: "", alias: "" });
    } catch (error) {
      console.error("Failed to shorten URL:", error);
      // You could handle specific server errors here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center text-center gap-16 w-full max-w-3xl pt-36">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Shorten Your URLs <br />
          <span className="text-primary">with Ease</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl px-4">
          No ads. No sign up. No bullshit. Just fast, reliable link shortening.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full max-w-3xl flex flex-col sm:flex-row items-start gap-3 bg-card p-3 rounded"
      >
        <div className="flex flex-col flex-1 gap-1.5 w-full">
          <InputGroup>
            <InputGroupInput
              id="inline-start-input"
              type="url"
              required
              placeholder="Paste your long URL here..."
              value={inputs.url}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, url: e.target.value }))
              }
            />
            <InputGroupAddon align="inline-start">
              <Link2 className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          {inputErrors.url.length > 0 && (
            <span className="text-destructive text-[11px] font-bold text-left ml-2">
              {inputErrors.url[0]}
            </span>
          )}
        </div>

        <div className="flex flex-col flex-[0.8] gap-1.5 w-full">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText className="font-bold text-base">
                {host}/
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              placeholder="custom alias (optional)"
              value={inputs.alias}
              minLength={6}
              maxLength={16}
              pattern="[a-zA-Z0-9\-_]+"
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, alias: e.target.value }))
              }
            />
          </InputGroup>
          {inputErrors.alias.length > 0 && (
            <span className="text-destructive text-[11px] font-bold text-left ml-2">
              {inputErrors.alias[0]}
            </span>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Shortening..." : "Shorten Link"}
        </Button>
      </form>
    </section>
  );
}
