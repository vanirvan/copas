import type {
  ErrorShortenAPIResponse,
  SuccessShortenAPIResponse,
} from "@/lib/types/shorten";

export async function postShorten({
  original_url,
  short_url,
}: {
  original_url: string;
  short_url: string;
}): Promise<SuccessShortenAPIResponse | ErrorShortenAPIResponse> {
  return await fetch(new URL("/api/shorten", process.env.NEXT_PUBLIC_APP_URL), {
    method: "POST",
    body: JSON.stringify({
      original_url,
      short_url,
    }),
  }).then((res) => res.json());
}
