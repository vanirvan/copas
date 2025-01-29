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
  return await fetch("http://localhost:3000/api/shorten", {
    method: "POST",
    body: JSON.stringify({
      original_url,
      short_url,
    }),
  }).then((res) => res.json());
}
