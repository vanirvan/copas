import { and, desc, eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db/db";
import { shortens, views } from "@/lib/db/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shorten: string }> },
) {
  const alias = (await params).shorten;

  try {
    const data = await db
      .select()
      .from(shortens)
      .where(eq(shortens.alias, alias))
      .orderBy(desc(shortens.created_at))
      .limit(1);

    if (!data.length) {
      return NextResponse.json({ error: "Url not found" }, { status: 404 });
    }

    const ip = req.headers.get("x-forwarded-for");

    if (ip) {
      const viewsRecord = await db
        .select()
        .from(views)
        .where(
          and(
            eq(views.ip, ip),
            eq(views.shorten_id, data[0].id),
            gte(views.created_at, new Date(Date.now() - 24 * 60 * 60 * 1000)),
          )
        )
        .limit(1);

      if (!viewsRecord[0]) {
        await db.insert(views).values({ ip, shorten_id: data[0].id });
      }
    }

    return NextResponse.redirect(data[0].url);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Something went wrong with our server. Please try again later",
      },
      { status: 500 },
    );
  }
}
