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

    const ip = req.headers.get("x-forwarded-for");

    if (ip) {
      // check if the particular ip address has already visiting this url for the past 24 hours
      const { data: views } = await supabase
        .from("views")
        .select("id")
        .eq("ip", ip)
        .eq("shorten_id", data.id)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000))
        .single();

      if(views){
        const { error: viewError } = await supabase.from("views").insert({
          ip,
          shorten_id: data.id
        })
  
        if (viewError) {
          console.error(viewError);
        }
      }
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
