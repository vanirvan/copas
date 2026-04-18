import { createServerFn } from "@tanstack/react-start";
import { urlSchema } from "#/lib/validations/url-validation";
import { nanoid } from "nanoid";
import { db } from "#/lib/db";
import { links, type NewLink } from "#/lib/db/schema";

export const shortenUrl = createServerFn({ method: "POST" })
  .inputValidator(urlSchema)
  .handler(async ({ data }) => {
    // // Fallback to nanoid if alias is empty string
    const alias =
      data.alias && data.alias.trim() !== "" ? data.alias : nanoid(8);

    const newlink: NewLink = {
      url: data.url,
      alias: alias,
    };

    try {
      await db.insert(links).values(newlink);
      console.log("Successfully inserted link:", { url: data.url, alias });
    } catch (error) {
      console.error("Database insertion failed:", error);
      throw error; // Re-throw to let TanStack Start handle the error response
    }

    return { url: data.url, alias };
  });
