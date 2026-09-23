"use client";

import { useRef, useState } from "react";
import { loadSnapshot, Tldraw, type TLEditorSnapshot } from "tldraw";
import { createClient } from "@/lib/supabase/client";
import "tldraw/tldraw.css";

type NoteCanvasProps = {
  noteId: string;
  initialDocument: TLEditorSnapshot["document"] | null;
};

export default function NoteCanvas({
  noteId,
  initialDocument,
}: NoteCanvasProps) {
  const [saveStatus, setSaveStatus] = useState("Changes save automatically");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div className="mt-8">
      <p className="mb-2 text-sm text-[#8b897f]" aria-live="polite">
        {saveStatus}
      </p>

      <div className="h-[70dvh] min-h-105 overflow-hidden rounded-2xl border border-[#e5e3dd]">
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
    </div>
  );
}
