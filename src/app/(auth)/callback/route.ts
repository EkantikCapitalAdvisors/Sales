import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  console.log("Supabase URL:", supabaseUrl);
  console.log("Anon key length:", anonKey.length, "starts with:", anonKey.substring(0, 20));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // ignore
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log("Auth success, user:", data.user?.email);
      return NextResponse.redirect(`${origin}/pipeline`);
    }
    console.error("Auth callback error:", error.message);
  } else {
    console.error("No code in callback URL");
  }

  // If no code or error, redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
