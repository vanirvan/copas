"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { LinkIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { bulkInsertShorten } from "@/lib/fetchs/bulk-insert-shorten";
import { deleteShorten } from "@/lib/fetchs/delete-shorten";
import { getShorten } from "@/lib/fetchs/get-shorten";

import { DeleteShortenModal } from "./DeleteShortenModal";
import { ShortenCard } from "./ShortenCard";
import { queryClient } from "./providers/QueryProvider";

export function ShortenLists({ user }: { user: string | null }) {
  const [localUrls, , deleteUrls] = useLocalStorage<
    { original_url: string; short_url: string }[]
  >("url_lists", []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["urls"],
    queryFn: getShorten,
    enabled: !!user,
  });

  const { mutate: bulkInsertMutation } = useMutation({
    mutationKey: ["bulk-insert-urls"],
    mutationFn: bulkInsertShorten,
    onSuccess: () => {
      console.log("Bulk insert successful!");
      deleteUrls();
    },
    onError: (error) => {
      console.error("Bulk insert failed:", error);
    },
  });

  const [deleteData, setDeleteData] = useState<{
    original_url: string;
    short_url: string;
  }>({ original_url: "", short_url: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const { mutate: deleteShortenMutation } = useMutation({
    mutationKey: ["delete-shorten"],
    mutationFn: deleteShorten,
    onSuccess: () => {
      console.log("Delete Url success!");
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Delete Url failed:", error);
    },
  });

  const handleDeleteUrl = ({
    original_url,
    short_url,
  }: {
    original_url: string;
    short_url: string;
  }) => {
    setDeleteData({ original_url, short_url });
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (user && localUrls.length > 0) {
      console.log(
        "User signed in with localStorage data. Performing bulk insert...",
      );
      bulkInsertMutation(localUrls);
    }
    // [user, urls, mutation]
  }, [user, localUrls, bulkInsertMutation]);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {/* only appear when one or more urls are stored, wether in local or cloud after signed in */}
          {(!user && localUrls.length > 0) ||
          (user && data && "data" in data && data.data.length > 0) ? (
            <div className="fixed bottom-6 right-6 w-max">
              <div className="relative">
                <Button
                  variant={"default"}
                  size={"icon"}
                  className="rounded-full"
                >
                  <LinkIcon size={24} />
                </Button>
              </div>
            </div>
          ) : null}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{user ? "" : "You're not Signed In!"}</SheetTitle>
            <SheetDescription>
              {user
                ? ""
                : "Your Urls would not work after 24 hours. Sign In now and secure your Urls!"}
            </SheetDescription>
          </SheetHeader>
          <div className={`flex flex-col gap-3 ${!user ? "mt-12" : ""}`}>
            {isLoading && (
              <LoaderCircleIcon size={24} className="animate-spin" />
            )}
            {isError && <p>Error fetching URLs. Please try again later.</p>}

            {/* Render URLs based on user state */}
            {!user &&
              localUrls.map((url, key) => (
                <ShortenCard
                  key={key}
                  original_url={url.original_url}
                  short_url={url.short_url}
                  deleteFn={handleDeleteUrl}
                />
              ))}
            {user &&
              data &&
              "data" in data &&
              data.data.map((url, key) => (
                <ShortenCard
                  key={key}
                  original_url={url.original_url}
                  short_url={url.short_url}
                  deleteFn={handleDeleteUrl}
                />
              ))}
          </div>
        </SheetContent>
      </Sheet>

      <DeleteShortenModal
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        data={deleteData}
        deleteFn={deleteShortenMutation}
      />
    </>
  );
}
