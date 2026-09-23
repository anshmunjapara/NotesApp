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
    <form className="mt-4 flex flex-wrap gap-2" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-xl border border-[#e9e8ef] bg-[#f8f7fb] px-3.5 py-2.5 text-sm text-[#25252c] outline-none transition placeholder:text-[#a3a2ad] focus:border-[#a9d94d] focus:bg-white focus:ring-4 focus:ring-[#b8f23f]/15"
        aria-label="Note title"
        placeholder="New note title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <button
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#17171d] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b2b33] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? "Saving…" : <><span aria-hidden="true">+</span> Add note</>}
      </button>

      {message ? (
        <p className="w-full text-sm text-[#a64f3e]" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
