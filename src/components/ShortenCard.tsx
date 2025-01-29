"use client";

import { CheckIcon, CopyIcon, GlobeIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button, buttonVariants } from "./ui/button";

export function ShortenCard({
  original_url,
  short_url,
  deleteFn,
}: {
  original_url: string;
  short_url: string;
  deleteFn: ({
    original_url,
    short_url,
  }: {
    original_url: string;
    short_url: string;
  }) => void;
}) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    copy(new URL(short_url, process.env.NEXT_PUBLIC_APP_URL!).toString());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{short_url}</CardTitle>
        <CardDescription className="truncate text-sm font-thin italic">
          {original_url}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-end gap-2 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={original_url}
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => deleteFn({ original_url, short_url })}
                type="button"
                size={"icon"}
                variant={"outline"}
                className="text-white-500 dark:text-white-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
              >
                <TrashIcon size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete URL</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
