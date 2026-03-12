"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/pipeline");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A]">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A951] mx-auto mb-4" />
        <p>Signing you in...</p>
      </div>
    </div>
  );
}
