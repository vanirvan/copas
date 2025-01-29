import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/db/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shorten: string }> },
) {
  const alias = (await params).shorten;

  try {
    const { data, error } = await supabase
      .from("shortens")
      .select("*")
      .eq("alias", alias)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "Something went wrong with our server. Please try again later",
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Url not found" }, { status: 404 });
    }

    return NextResponse.redirect(data.url);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Something went wrong with our server. Please try again later",
      },
      { status: 500 },
    );
  }
}
