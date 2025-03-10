import { NextResponse } from "next/server";
import db from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { UserCreatedWebhook } from "@/lib/types/webhook";
import { isValidWebhookType } from "@/lib/utils/invalid-webhook-type";

export async function POST(request: Request) {
  const webhookPayload: UserCreatedWebhook = await request.json();

  const webhook = isValidWebhookType(webhookPayload);
  if (!webhook) {
    return NextResponse.json({});
  }

  const primaryEmailAddress = webhookPayload.data.email_addresses.find(
    (emailAddress) =>
      emailAddress.id === webhookPayload.data.primary_email_address_id
  );

  if (!primaryEmailAddress) {
    return NextResponse.json(
      { message: "Primary email address not found" },
      { status: 400 }
    );
  }

  try {
    await db.insert(users).values({
      user_id: webhookPayload.data.id,
      name: `${webhookPayload.data.first_name} ${webhookPayload.data.last_name}`,
      email: primaryEmailAddress.email_address,
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "User created" }, { status: 200 });
}
