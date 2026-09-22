import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { error } from "console";

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
    .select("id, title")
    .eq("id", noteId)
    .single();

  if (error || !note) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-6 py-8 text-[#252525] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link className="text-sm text-[#77746b] hover:text-[#252525]" href="/">
          ← Back to Home
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight">
          {note.title}
        </h1>

        <section className="mt-8 flex min-h-[60vh] items-center justify-center rounded-2xl border border-dashed border-[#cbc8bf] text-center">
          <div>
            <p className="font-medium">This note’s canvas will go here</p>
            <p className="mt-2 text-sm text-[#8b897f]">
              Next, we’ll add tldraw to this page.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
