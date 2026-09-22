import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";
import CreateCategoryForm from "./create-category-form";
import CreateNoteForm from "./create-note-form";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (error) {
    console.error("Could not load user:", error.message);
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .order("created_at", { ascending: true });

  if (categoriesError) {
    console.log("Could not load categories: ", categoriesError.message);
  }

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("id, title, category_id")
    .order("created_at", { ascending: true });

  if (notesError) {
    console.error("Could not load notes:", notesError.message);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#252525]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-[#e5e3dd] px-6 py-6 lg:w-72 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b897f]">
                Notes
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                Your thinking space
              </h1>
            </div>
            <div className="mt-6">
              <p className="truncate text-xs text-[#8b897f]">{user?.email}</p>

              <div className="mt-3">
                <LogoutButton />
              </div>
            </div>
            <button
              className="rounded-full bg-[#252525] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#454545] lg:mt-8"
              type="button"
            >
              + New note
            </button>
          </div>
          <nav
            className="mt-10 hidden space-y-2 lg:block"
            aria-label="Main navigation"
          >
            <a
              className="block rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm"
              href="#notes"
            >
              All notes
            </a>
            <a
              className="block rounded-xl px-4 py-3 text-sm text-[#77746b] transition hover:bg-white"
              href="#canvas"
            >
              Canvas
            </a>
          </nav>
        </aside>

        <section className="flex-1 px-6 py-8 lg:px-14 lg:py-12" id="notes">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#8b897f]">Monday, September 21</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                All notes
              </h2>
            </div>
            <span className="hidden rounded-full border border-[#dedcd5] px-3 py-1 text-xs text-[#8b897f] sm:inline-block">
              2 notes
            </span>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">Categories</h2>

            {categories?.length ? (
              <div className="mt-4 space-y-5">
                {categories.map((category) => {
                  const categoryNotes =
                    notes?.filter((note) => note.category_id === category.id) ??
                    [];

                  return (
                    <article
                      className="rounded-2xl border border-[#e5e3dd] bg-white p-5"
                      key={category.id}
                    >
                      <h3 className="font-semibold">{category.name}</h3>

                      {categoryNotes.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {categoryNotes.map((note) => (
                            <li
                              className="text-sm text-[#77746b]"
                              key={note.id}
                            >
                              <Link
                                className="text-sm text-[#77746b] hover:text-[#252525]"
                                href={`/notes/${note.id}`}
                              >
                                {note.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-[#8b897f]">
                          No notes yet.
                        </p>
                      )}

                      <CreateNoteForm categoryId={category.id} />
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#8b897f]">No categories yet.</p>
            )}

            <CreateCategoryForm />
          </section>
        </section>
      </div>
    </main>
  );
}
