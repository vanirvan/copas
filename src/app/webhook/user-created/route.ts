import { NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";
import { UserCreatedWebhook } from "@/lib/types/webhook";
import { isValidWebhookType } from "@/lib/utils/invalid-webhook-type";

export async function POST(request: Request) {
  const webhookPayload: UserCreatedWebhook = await request.json();

  const webhook = isValidWebhookType(webhookPayload);
  if (!webhook) {
    return NextResponse.json({});
  }

  const primaryEmailAddress = webhookPayload.data.email_addresses.findIndex(
    (emailAddress) =>
      emailAddress.id === webhookPayload.data.primary_email_address_id,
  );

  try {
    const { error } = await supabase.from("users").insert({
      user_id: webhookPayload.data.id,
      name: `${webhookPayload.data.first_name} ${webhookPayload.data.last_name}`,
      email:
        webhookPayload.data.email_addresses[primaryEmailAddress].email_address,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error creating user" },
        { status: 500 },
      );
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "User created" }, { status: 200 });
}
