import { createServerFn } from "@tanstack/react-start";
import { urlSchema } from "@/lib/validations/url-validation";

export const shortenUrl = createServerFn({ method: "POST" })
  .inputValidator(urlSchema)
  .handler(async ({ data }) => {
    // process data here
    return data;
  });
