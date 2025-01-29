"use client";

import { useMutation } from "@tanstack/react-query";

import { CheckIcon, CopyIcon, Dice5Icon, GlobeIcon } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";

import { queryClient } from "@/components/providers/QueryProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { postShorten } from "@/lib/fetchs/post-shorten";
import { generateAlias } from "@/lib/utils/generateAlias";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function ShortenForm({ user }: { user: string | null }) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(
      new URL(
        showResult.short_url,
        process.env.NEXT_PUBLIC_APP_URL!,
      ).toString(),
    );

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const [, setUrls] = useLocalStorage<
    { original_url: string; short_url: string }[]
  >("url_lists", []);

  // input values
  const [form, setForm] = useState({
    original_url: "",
    short_url: "",
  });

  // errors lists
  const [formError, setFormError] = useState<{
    original_url: string[];
    short_url: string[];
    general_error: string[];
  }>({
    original_url: [],
    short_url: [],
    general_error: [],
  });

  const [showResult, setShowResult] = useState({
    show: false,
    original_url: "",
    short_url: "",
  });

  // react-query's mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-new-url"],
    mutationFn: postShorten,
    onSuccess: (data) => {
      if ("error" in data) {
        setFormError({
          original_url: data.error.original_url || [],
          short_url: data.error.short_url || [],
          general_error: data.error.general_error || [],
        });
      } else {
        // Reset form and errors on success
        setForm({ original_url: "", short_url: "" });
        setFormError({ original_url: [], short_url: [], general_error: [] });

        if (user) {
          // if user is null, put the data into localStorage
          queryClient.invalidateQueries({ queryKey: ["urls"] });
        } else {
          // otherwise, invalidate queries
          setUrls((prev) => [
            ...prev,
            {
              original_url: data.data.original_url,
              short_url: data.data.short_url,
            },
          ]);
        }

        setShowResult({
          show: true,
          original_url: data.data.original_url,
          short_url: data.data.short_url,
        });
      }
    },
    onError: () => {
      setFormError({
        original_url: [],
        short_url: [],
        general_error: ["An unexpected error occurred. Please try again."],
      });
    },
  });

  const handleGenerateAlias = () => {
    const alias = generateAlias();
    setForm((prev) => ({
      ...prev,
      short_url: alias,
    }));
  };

  const _onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // reset form error
    setFormError({
      original_url: [],
      short_url: [],
      general_error: [],
    });

    // mutate the data
    mutate({ original_url: form.original_url, short_url: form.short_url });
  };

  return (
    <Card className="w-full max-w-xl bg-white shadow-2xl transition-colors duration-200 dark:bg-[hsl(243,52%,5%)] dark:shadow-gray-500">
      <CardContent className="p-6">
        {!showResult.show && (
          <>
            <form
              id="shorten"
              onSubmit={_onSubmit}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="original_url" className="text-xl">
                  Input a long URL
                </Label>
                <Input
                  id="original_url"
                  type="url"
                  placeholder="Enter your URL"
                  name="original_url"
                  autoFocus
                  value={form.original_url ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, original_url: e.target.value })
                  }
                />
                {formError.original_url.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {formError.original_url.map((ou, key) => (
                      <p key={key} className="text-sm text-red-500">
                        {ou}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="short_url" className="text-xl">
                  Customize your Link
                </Label>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Input
                    id="domain"
                    type="text"
                    name="domain"
                    value={process.env.NEXT_PUBLIC_SHORT_APP_URL}
                    disabled
                    className="flex-shrink"
                  />
                  <Input
                    id="short_url"
                    type="text"
                    placeholder="Alias"
                    name="short_url"
                    value={form.short_url ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, short_url: e.target.value })
                    }
                  />
                </div>
                {formError.short_url.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {formError.short_url.map((su, key) => (
                      <p key={key} className="text-sm text-red-500">
                        {su}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {formError.general_error.length > 0 && (
                <div className="flex flex-col gap-1">
                  {formError.general_error.map((ge, key) => (
                    <p key={key} className="text-sm text-red-500">
                      {ge}
                    </p>
                  ))}
                </div>
              )}
            </form>
          </>
        )}

        {showResult.show && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="url_destination" className="text-xl">
                Url Destination
              </Label>
              <Input
                id="url_destination"
                type="url"
                name="url_destination"
                autoFocus
                value={showResult.original_url ?? ""}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="result_url" className="text-xl">
                Short Url
              </Label>
              <Input
                id="result_url"
                type="url"
                name="result_url"
                autoFocus
                value={
                  showResult.short_url
                    ? new URL(
                        showResult.short_url,
                        process.env.NEXT_PUBLIC_APP_URL!,
                      ).toString()
                    : ""
                }
                disabled
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2">
        {showResult.show ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={showResult.original_url}
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <GlobeIcon size={24} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visit Url</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopy}
                    type="button"
                    size={"icon"}
                    variant={"outline"}
                    className={`${copied && "text-white-500 dark:text-white-500 bg-green-500 hover:bg-green-500 dark:hover:bg-green-500"}`}
                  >
                    {copied ? <CheckIcon size={24} /> : <CopyIcon size={24} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? (
                    <p>URL Copied to Clipboard</p>
                  ) : (
                    <p>Copy to Clipboard</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={() =>
                setShowResult({ show: false, original_url: "", short_url: "" })
              }
              type="button"
            >
              Shorten another Url
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => handleGenerateAlias()}
              variant={"secondary"}
              disabled={isPending}
            >
              <Dice5Icon />
              Randomize Alias
            </Button>
            <Button form="shorten" type="submit" disabled={isPending}>
              Shorten
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
