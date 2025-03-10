import { NextResponse } from "next/server";
import db from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { UserDeletedWebhook } from "@/lib/types/webhook";
import { isValidWebhookType } from "@/lib/utils/invalid-webhook-type";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const webhookPayload: UserDeletedWebhook = await request.json();

  const webhook = isValidWebhookType(webhookPayload);
  if (!webhook) {
    return NextResponse.json({});
  }

  try {
    await db.delete(users).where(eq(users.user_id, webhookPayload.data.id));
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Error Deleting user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "User Deleted" }, { status: 200 });
}