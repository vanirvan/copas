import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/db";
import { users, shortens } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { data }: { data: { original_url: string; short_url: string }[] } =
    await req.json();

  try {
    // Find user first
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You are not logged in, please login to continue." },
        { status: 401 }
      );
    }

    // Get the user's ID from the database
    const userRecord = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.user_id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return returnPOSTError500("User not found.");
    }

    const user_id = userRecord[0].id;

    // Perform bulk insert using Drizzle
    await db.update(shortens).set({ user_id: user_id }).where(inArray(shortens.alias, data.map(d => d.short_url)));
    
    return NextResponse.json({ message: "Success" });
  } catch (e) {
    return returnPOSTError500(e);
  }
}

function returnPOSTError500(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { error: "Something went wrong with our server, please try again later." },
    { status: 500 }
  );
}
