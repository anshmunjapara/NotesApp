"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CreateNoteFormProps = {
  categoryId: string;
};

export default function CrreateNoteForm({ categoryId }: CreateNoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const noteTitle = title.trim();

    if (!noteTitle) {
      setMessage("Enter a note title.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.from("notes").insert({
      title: noteTitle,
      category_id: categoryId,
    });

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    setTitle("");
    setIsSaving(false);
    router.refresh();
  }

  return (
    <form className="mt-4 flex flex-wrap gap-3" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-xl border border-[#dedcd5] bg-white px-4 py-3 outline-none focus:border-[#252525]"
        aria-label="Note title"
        placeholder="New note title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <button
        className="rounded-full bg-[#252525] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? "Saving…" : "Add note"}
      </button>

      {message ? (
        <p className="w-full text-sm text-[#9a4d3e]" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
