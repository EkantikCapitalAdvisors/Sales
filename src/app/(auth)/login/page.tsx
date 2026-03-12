"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B2A4A]">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1B2A4A] font-[Georgia,serif]">
            Ekantik Capital
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Founding Member CRM
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 text-base"
            variant="default"
          >
            Sign in with Google
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Access restricted to authorized Ekantik Capital team members.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-300 uppercase tracking-wider">
            Internal — Confidential
          </p>
        </div>
      </div>
    </div>
  );
}
