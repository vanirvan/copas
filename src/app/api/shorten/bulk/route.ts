import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";

export async function POST(req: NextRequest) {
  const { data }: { data: { original_url: string; short_url: string }[] } =
    await req.json();

  try {
    // find user first
    const { userId } = await auth();

    let user_id: number | null = null;

    if (userId) {
      const { data: getUser, error: getUserError } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (getUserError) {
        return returnPOSTError500(getUserError);
      }

      if (getUser) {
        user_id = getUser.id;
      }
    }

    if (!user_id) {
      return NextResponse.json(
        {
          error: "You are not logged in, please login to continue.",
        },
        { status: 401 },
      );
    }

    const { error: bulkError } = await supabase
      .from("shortens")
      .update({ user_id: user_id })
      .in(
        "alias",
        data.map((d) => d.short_url),
      );

    if (bulkError) {
      return returnPOSTError500(bulkError);
    }

    return NextResponse.json({
      message: "success",
    });
  } catch (e) {
    return returnPOSTError500(e);
  }
}

function returnPOSTError500(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      error: "Something went wrong with our server, please try again later.",
    },
    { status: 500 },
  );
}
