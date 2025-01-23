import { NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";
import { UserUpdatedWebhook } from "@/lib/types/webhook";
import { isValidWebhookType } from "@/lib/utils/invalid-webhook-type";

export async function POST(request: Request) {
  const webhookPayload: UserUpdatedWebhook = await request.json();

  const webhook = isValidWebhookType(webhookPayload);
  if (!webhook) {
    return NextResponse.json({});
  }

  try {
    const { data: getUser, error: getUserError } = await supabase
      .from("users")
      .select("user_id, name, email")
      .eq("user_id", webhookPayload.data.id)
      .single();

    if (getUserError) {
      console.error("Error Getting user data when performing update");
      console.error(getUserError);
      return NextResponse.json(
        { message: "Error Getting user data when performing update" },
        { status: 500 },
      );
    }

    if (getUser === null) {
      console.log("User not found when performing update");
      return NextResponse.json(
        {
          message: "User ID does not match",
        },
        { status: 400 },
      );
    }

    const updatedFields: { name?: string; email?: string } = {};

    if (
      getUser.name !==
      `${webhookPayload.data.first_name} ${webhookPayload.data.last_name}`
    ) {
      updatedFields.name = `${webhookPayload.data.first_name} ${webhookPayload.data.last_name}`;
    }

    const userPrimaryEmailAddress =
      webhookPayload.data.email_addresses[
        webhookPayload.data.email_addresses.findIndex(
          (emailAddress) =>
            emailAddress.id === webhookPayload.data.primary_email_address_id,
        )
      ].email_address;
    if (getUser.email !== userPrimaryEmailAddress) {
      updatedFields.email = userPrimaryEmailAddress;
    }

    if (updatedFields.name === undefined && updatedFields.email === undefined) {
      console.log(`No changes when updating user`);
      return NextResponse.json(
        { message: "No changes to user" },
        { status: 200 },
      );
    }

    const { error } = await supabase
      .from("users")
      .update(updatedFields)
      .eq("user_id", webhookPayload.data.id);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error Updating user" },
        { status: 500 },
      );
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Error Updating user" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "User Deleted" }, { status: 200 });
}
