export async function deleteShorten({
  original_url,
  short_url,
}: {
  original_url: string;
  short_url: string;
}): Promise<{ message: string } | { error: string }> {
  return await fetch("http://localhost:3000/api/shorten", {
    method: "DELETE",
    body: JSON.stringify({
      original_url,
      short_url,
    }),
  }).then((res) => res.json());
}
