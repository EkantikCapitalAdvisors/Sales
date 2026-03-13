"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/login");
      return;
    }

    const supabase = createClient();
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          console.error("Auth callback error:", error);
          router.push("/login");
        } else {
          router.push("/pipeline");
        }
      });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A]">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A951] mx-auto mb-4" />
        <p>Signing you in...</p>
      </div>
    </div>
  );
}
