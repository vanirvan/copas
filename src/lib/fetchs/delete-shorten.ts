export async function deleteShorten({
  original_url,
  short_url,
}: {
  original_url: string;
  short_url: string;
}): Promise<{ message: string } | { error: string }> {
  return await fetch(new URL("/api/shorten", process.env.NEXT_PUBLIC_APP_URL), {
    method: "DELETE",
    body: JSON.stringify({
      original_url,
      short_url,
    }),
  }).then((res) => res.json());
}
