import { createClient } from "@/lib/supabase/server";
import NoteCanvas from "@/app/note-canvas";
import { notFound, redirect } from "next/navigation";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("id, title, canvas_document")
    .eq("id", noteId)
    .single();

  if (error || !note) {
    notFound();
  }

  return (
    <NoteCanvas
      noteId={note.id}
      title={note.title}
      initialDocument={note.canvas_document}
    />
  );
}
