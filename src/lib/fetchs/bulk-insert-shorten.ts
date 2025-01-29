export async function bulkInsertShorten(
  data: { original_url: string; short_url: string }[],
): Promise<{ message: string } | { error: string }> {
  return await fetch(
    new URL("/api/shorten/bulk", process.env.NEXT_PUBLIC_APP_URL),
    {
      method: "POST",
      body: JSON.stringify({
        data,
      }),
    },
  ).then((res) => res.json());
}
