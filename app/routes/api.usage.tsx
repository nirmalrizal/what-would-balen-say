import { getUsageStats } from "~/lib/ai.server";

export async function loader() {
  return Response.json(
    { ...getUsageStats(), updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
