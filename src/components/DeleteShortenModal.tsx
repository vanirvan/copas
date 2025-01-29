import { useMediaQuery } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function DeleteShortenModal({
  open,
  setOpen,
  data,
  deleteFn,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: { original_url: string; short_url: string };
  deleteFn: ({
    original_url,
    short_url,
  }: {
    original_url: string;
    short_url: string;
  }) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDelete = () => {
    deleteFn({
      original_url: data.original_url,
      short_url: data.short_url,
    });
  };

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete URL</DialogTitle>
          <DialogDescription>
            URL <span className="font-bold">{data.short_url}</span>{" "}
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={handleDelete}
          variant={"destructive"}
          className="w-full"
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Delete URL</DrawerTitle>
          <DrawerDescription>
            URL <span className="font-bold">{data.short_url}</span> will be
            deleted, are you sure?
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Button
            onClick={handleDelete}
            variant={"destructive"}
            className="w-full"
          >
            Delete
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
