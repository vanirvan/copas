export async function bulkInsertShorten(
  data: { original_url: string; short_url: string }[],
): Promise<{ message: string } | { error: string }> {
  return await fetch("http://localhost:3000/api/shorten/bulk", {
    method: "POST",
    body: JSON.stringify({
      data,
    }),
  }).then((res) => res.json());
}
