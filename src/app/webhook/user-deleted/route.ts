import { NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";
import { UserDeletedWebhook } from "@/lib/types/webhook";
import { isValidWebhookType } from "@/lib/utils/invalid-webhook-type";

export async function POST(request: Request) {
  const webhookPayload: UserDeletedWebhook = await request.json();

  const webhook = isValidWebhookType(webhookPayload);
  if (!webhook) {
    return NextResponse.json({});
  }

  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", webhookPayload.data.id);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error Deleting user" },
        { status: 500 },
      );
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Error Deleting user" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "User Deleted" }, { status: 200 });
}
