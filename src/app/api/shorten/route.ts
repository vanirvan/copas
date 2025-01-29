import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";
import { urlValidation } from "@/lib/validations/urlValidation";

export async function GET() {
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
        return returnGETError500(getUserError);
      }

      if (getUser) {
        user_id = getUser.id;
      }
    }

    if (!user_id) {
      return NextResponse.json(
        {
          error: "You are not logged in.",
        },
        { status: 401 },
      );
    }

    const { data: urls, error: urlsError } = await supabase
      .from("shortens")
      .select("*")
      .eq("user_id", user_id);

    if (urlsError) {
      return returnGETError500(urlsError);
    }

    return NextResponse.json({
      data: urls?.map((url) => {
        return {
          id: url.id,
          original_url: url.url,
          short_url: url.alias,
          created_at: url.created_at,
        };
      }),
    });
  } catch (e) {
    return returnGETError500(e);
  }
}

export async function POST(req: NextRequest) {
  const { original_url, short_url } = await req.json();

  // validate input url
  const { success: validationSuccess, data: validationData } =
    await urlValidation({
      original_url,
      short_url,
    });

  if (!validationSuccess) {
    return NextResponse.json(
      {
        error: {
          original_url: validationData.original_url,
          short_url: validationData.short_url,
          general_error: [],
        },
      },
      { status: 500 },
    );
  }

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

    // process to store the shorten url
    const { data, error } = await supabase
      .from("shortens")
      .insert({
        url: original_url,
        alias: short_url,
        user_id: user_id,
      })
      .select()
      .single();

    if (error) {
      return returnPOSTError500(error);
    }

    return NextResponse.json({
      data: {
        original_url: data.url,
        short_url: data.alias,
      },
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
        {
          error: "You are not logged in, please login to continue.",
        },
        { status: 401 },
      );
    }

    const { data: getUser, error: getUserError } = await supabase
      .from("users")
      .select()
      .eq("user_id", userId)
      .single();

    if (getUserError) {
      return returnGETError500(getUserError);
    }

    if (!getUser) {
      return NextResponse.json(
        {
          error: "You are not logged in, please login to continue.",
        },
        { status: 401 },
      );
    }

    const { error: deleteError } = await supabase
      .from("shortens")
      .delete()
      .eq("url", original_url)
      .eq("alias", short_url)
      .eq("user_id", getUser.id);

    if (deleteError) {
      console.log("Delete Shorten Error");
      console.error(deleteError);
      return NextResponse.json(
        {
          error: deleteError.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      status: true,
      message: "success",
    });
  } catch (e) {
    return returnGETError500(e);
  }
}

function returnGETError500(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      error: "Something went wrong with our server, please try again later.",
    },
    {
      status: 500,
    },
  );
}

function returnPOSTError500(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      error: {
        original_url: [],
        short_url: [],
        general_error: [
          "Something went wrong with our server, please try again later.",
        ],
      },
    },
    { status: 500 },
  );
}
