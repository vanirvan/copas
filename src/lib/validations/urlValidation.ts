import { z } from "zod";

import db from "@/lib/db/db";
import { shortens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const allowedCharRegex = /^[a-zA-Z0-9-_]+$/;

const urlValidationSchema = z.object({
  original_url: z.string().url(),
  short_url: z
    .string()
    .min(6, { message: "must be at least 6 characters long" })
    .max(16, { message: "must be at most 16 characters long" })
    .refine((alias) => allowedCharRegex.test(alias), {
      message:
        "only alphanumeric, hyphen (-) and underscores characters allowed, please change it",
    })
    .refine(
      async (alias) => {
        const data = await db.select().from(shortens).where(eq(shortens.alias, alias)).limit(1);
        return !data.length;
      },
      { message: "already taken, please choose another one" }, 
    ),
});

export async function urlValidation({
  original_url,
  short_url,
}: {
  original_url: string;
  short_url: string;
}): Promise<{
  success: boolean;
  data: {
    original_url?: string | string[];
    short_url?: string | string[];
    general_error?: string[];
  };
}> {
  const validateInput = await urlValidationSchema.safeParseAsync({
    original_url,
    short_url,
  });

  if (!validateInput.success) {
    const errors = validateInput.error.flatten();

    return {
      success: false,
      data: {
        original_url: errors.fieldErrors.original_url,
        short_url: errors.fieldErrors.short_url,
        general_error: [],
      },
    };
  }

  return {
    success: true,
    data: {
      original_url: original_url,
      short_url: short_url,
    },
  };
}
