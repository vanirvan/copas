import { auth } from "@clerk/nextjs/server";

import { and, count, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db/db";
import { shortens, users, views } from "@/lib/db/schema";
import { urlValidation } from "@/lib/validations/urlValidation";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 },
      );
    }

    // Get user ID from the database
    const getUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.user_id, userId))
      .limit(1);

    if (!getUser.length) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user_id = getUser[0].id;

    // Fetch user's shortened URLs along with visitor counts
    const urls = await db
      .select({
        id: shortens.id,
        original_url: shortens.url,
        short_url: shortens.alias,
        created_at: shortens.created_at,
        visitor_count: count(views.id),
      })
      .from(shortens)
      .leftJoin(views, eq(shortens.id, views.shorten_id))
      .where(eq(shortens.user_id, user_id))
      .groupBy(shortens.id);

    return NextResponse.json({ data: urls });
  } catch (e) {
    return returnGETError500(e);
  }
}

export async function POST(req: NextRequest) {
  const { original_url, short_url } = await req.json();

  // Validate input URL
  const { success: validationSuccess, data: validationData } =
    await urlValidation({ original_url, short_url });

  if (!validationSuccess) {
    return NextResponse.json(
      {
        error: {
          original_url: validationData.original_url,
          short_url: validationData.short_url,
          general_error: [],
        },
      },
      { status: 400 },
    );
  }

  try {
    const { userId } = await auth();

    let user_id: number | null = null;

    if(userId){
      const getUser = await db.select({ id: users.id }).from(users).where(eq(users.user_id, userId)).limit(1);

      if (!getUser.length) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      user_id = getUser[0].id;
    }

    // Insert new short URL
    const inserted = await db
      .insert(shortens)
      .values({ url: original_url, alias: short_url, user_id })
      .returning({ id: shortens.id, alias: shortens.alias, url: shortens.url });

    if (!inserted.length) {
      return NextResponse.json(
        { error: "Failed to create short URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: { original_url: inserted[0].url, short_url: inserted[0].alias },
    });
  } catch (e) {
    return returnPOSTError500(e);
  }
}

export async function DELETE(req: NextRequest) {
  const { original_url, short_url } = await req.json();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 401 },
      );
    }

    // Get user ID from the database
    const getUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.user_id, userId))
      .limit(1);

    if (!getUser.length) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user_id = getUser[0].id;

    // Delete the short URL
    const deleted = await db
      .delete(shortens)
      .where(
        and(
          eq(shortens.user_id, user_id),
          eq(shortens.url, original_url),
          eq(shortens.alias, short_url),
        ),
      );

    if (!deleted.rowCount) {
      return NextResponse.json(
        { error: "Failed to delete short URL." },
        { status: 400 },
      );
    }

    return NextResponse.json({ status: true, message: "success" });
  } catch (e) {
    return returnGETError500(e);
  }
}

// Error handling functions
function returnGETError500(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { error: "Something went wrong with our server, please try again later." },
    { status: 500 },
  );
}

function returnPOSTError500(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      error: {
        original_url: [],
        short_url: [],
        general_error: ["Something went wrong, please try again later."],
      },
    },
    { status: 500 },
  );
}
