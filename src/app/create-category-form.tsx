"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      setMessage("Enter a category name.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .insert({ name: categoryName });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    setName("");
    setIsSaving(false);
    router.refresh();
  }

  return (
    <form className="flex flex-wrap gap-2.5" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-xl border border-[#e5e4ec] bg-[#f8f7fb] px-4 py-3 text-sm text-[#25252c] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#a9d94d] focus:bg-white focus:ring-4 focus:ring-[#b8f23f]/15"
        aria-label="Category name"
        placeholder="For example, CS320"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <button
        className="inline-flex items-center gap-2 rounded-xl bg-[#17171d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b33] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? "Saving…" : <><span aria-hidden="true">+</span> Add category</>}
      </button>

      {message ? (
        <p className="w-full text-sm text-[#a64f3e]" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
