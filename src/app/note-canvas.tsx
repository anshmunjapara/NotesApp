"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { loadSnapshot, Tldraw, type TLEditorSnapshot } from "tldraw";
import { createClient } from "@/lib/supabase/client";
import "tldraw/tldraw.css";

type NoteCanvasProps = {
  noteId: string;
  title: string;
  initialDocument: TLEditorSnapshot["document"] | null;
};

export default function NoteCanvas({
  noteId,
  title,
  initialDocument,
}: NoteCanvasProps) {
  const [saveStatus, setSaveStatus] = useState("Changes save automatically");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <main className="fixed inset-0 flex h-dvh flex-col overflow-hidden bg-[#f7f7f4] text-[#252525]">
      <header className="grid h-14 shrink-0 grid-cols-[1fr_minmax(0,2fr)_1fr] items-center gap-2 border-b border-[#e5e3dd] bg-white px-3 sm:h-16 sm:px-6">
        <Link
          className="w-fit rounded-lg px-2 py-2 text-sm text-[#625f57] transition hover:bg-[#f3f2ee] hover:text-[#252525] sm:px-3"
          href="/"
        >
          ← <span className="hidden sm:inline">Back to home</span>
          <span className="sm:hidden">Home</span>
        </Link>

        <h1 className="truncate text-center text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h1>

        <p
          className="truncate text-right text-xs text-[#77746b] sm:text-sm"
          aria-live="polite"
        >
          {saveStatus}
        </p>
      </header>

      <div className="min-h-0 flex-1">
        <Tldraw
          onMount={(editor) => {
            if (initialDocument) {
              loadSnapshot(editor.store, initialDocument);
            }

            const supabase = createClient();

            async function saveDocument() {
              setSaveStatus("Saving…");

              const document = editor.store.getStoreSnapshot("document");

              const { error } = await supabase
                .from("notes")
                .update({ canvas_document: document })
                .eq("id", noteId);

              setSaveStatus(error ? "Could not save canvas" : "Saved");
            }

            const unsubscribe = editor.store.listen(
              () => {
                setSaveStatus("Unsaved changes");

                if (saveTimer.current) {
                  clearTimeout(saveTimer.current);
                }

                saveTimer.current = setTimeout(() => {
                  saveTimer.current = null;
                  void saveDocument();
                }, 30000);
              },
              { source: "user", scope: "document" },
            );

            return () => {
              unsubscribe();

              if (saveTimer.current) {
                clearTimeout(saveTimer.current);
                saveTimer.current = null;
                void saveDocument();
              }
            };
          }}
        />
      </div>
    </main>
  );
}
