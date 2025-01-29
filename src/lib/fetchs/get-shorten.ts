import {
  ErrorGetShortenAPIResponse,
  SuccessGetShortenAPIResponse,
} from "@/lib/types/shorten";

export async function getShorten(): Promise<
  SuccessGetShortenAPIResponse | ErrorGetShortenAPIResponse
> {
  return await fetch(
    new URL("/api/shorten", process.env.NEXT_PUBLIC_APP_URL),
  ).then((res) => res.json());
}
