import {
  ErrorGetShortenAPIResponse,
  SuccessGetShortenAPIResponse,
} from "@/lib/types/shorten";

export async function getShorten(): Promise<
  SuccessGetShortenAPIResponse | ErrorGetShortenAPIResponse
> {
  return await fetch("http://localhost:3000/api/shorten").then((res) =>
    res.json(),
  );
}
