import { NextResponse } from "next/server";
import db from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { UserUpdatedWebhook } from "@/lib/types/webhook";
import { isValidWebhookType } from "@/lib/utils/invalid-webhook-type";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const webhookPayload: UserUpdatedWebhook = await request.json();

  const webhook = isValidWebhookType(webhookPayload);
  if (!webhook) {
    return NextResponse.json({});
  }

  try {
    const getUser = await db
      .select({ user_id: users.user_id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.user_id, webhookPayload.data.id))
      .then((res) => res[0]);

    if (!getUser) {
      console.log("User not found when performing update");
      return NextResponse.json(
        { message: "User ID does not match" },
        { status: 400 }
      );
    }

    const updatedFields: { name?: string; email?: string } = {};

    const fullName = `${webhookPayload.data.first_name} ${webhookPayload.data.last_name}`;
    if (getUser.name !== fullName) {
      updatedFields.name = fullName;
    }

    const primaryEmail = webhookPayload.data.email_addresses.find(
      (email) => email.id === webhookPayload.data.primary_email_address_id
    )?.email_address;

    if (primaryEmail && getUser.email !== primaryEmail) {
      updatedFields.email = primaryEmail;
    }

    if (Object.keys(updatedFields).length === 0) {
      console.log("No changes when updating user");
      return NextResponse.json(
        { message: "No changes to user" },
        { status: 200 }
      );
    }

    await db.update(users).set(updatedFields).where(eq(users.user_id, webhookPayload.data.id));
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Error Updating user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "User Updated" }, { status: 200 });
}
