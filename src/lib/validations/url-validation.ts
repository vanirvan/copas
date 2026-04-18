import { z } from "zod";

export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  alias: z
    .string()
    .min(6, "Alias must be at least 6 characters")
    .max(16, "Alias must be at most 16 characters")
    .regex(
      /^[a-zA-Z0-9\-_]+$/,
      "Alias can only contain letters, numbers, hyphens, and underscores",
    )
    .optional()
    .or(z.literal("")),
});

export type UrlSchemaType = z.infer<typeof urlSchema>;
