"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="rounded-full border border-[#dedcd5] px-4 py-2 text-sm text-[#77746b] transition hover:border-[#252525] hover:text-[#252525]"
      onClick={handleLogout}
      type="button"
    >
      Sign out
    </button>
  );
}
