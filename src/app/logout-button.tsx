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
      className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium text-[#898995] transition hover:bg-[#f4f3f8] hover:text-[#19191f]"
      onClick={handleLogout}
      type="button"
    >
      Sign out
    </button>
  );
}
