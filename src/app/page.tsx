import Link from "next/link";
import { redirect } from "next/navigation";
import CreateCategoryForm from "./create-category-form";
import CreateNoteForm from "./create-note-form";
import LogoutButton from "./logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: categories }, { data: notes }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .order("created_at", { ascending: true }),
    supabase
      .from("notes")
      .select("id, title, category_id")
      .order("created_at", { ascending: true }),
  ]);

  const categoryList = categories ?? [];
  const noteList = notes ?? [];

  return (
    <main className="min-h-screen bg-[#f1f0f6] text-[#19191f]">
      <div className="min-h-screen lg:flex">
        <aside className="border-b border-[#e5e4ec] bg-white px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[272px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
          <Link
            className="flex items-center gap-3"
            href="/"
            aria-label="Notes home"
          >
            <span className="grid size-10 grid-cols-2 gap-1 rounded-[14px] bg-[#15151b] p-2.5">
              <span className="rounded-[3px] bg-white" />
              <span className="rounded-[3px] bg-[#b8f23f]" />
              <span className="rounded-[3px] bg-white/45" />
              <span className="rounded-[3px] bg-white" />
            </span>
            <span>
              <span className="block text-[17px] font-semibold tracking-tight">
                Notes
              </span>
              <span className="block text-xs text-[#92919c]">
                Your private workspace
              </span>
            </span>
          </Link>

          <nav
            className="mt-7 flex gap-2 overflow-x-auto pb-1 lg:mt-12 lg:block lg:space-y-1 lg:overflow-visible"
            aria-label="Workspace navigation"
          >
            <a
              className="flex shrink-0 items-center gap-3 rounded-xl bg-[#17171d] px-3.5 py-3 text-sm font-medium text-white shadow-sm lg:w-full"
              href="#categories"
            >
              <span
                className="grid size-5 grid-cols-2 gap-0.5"
                aria-hidden="true"
              >
                <span className="rounded-xs bg-white" />
                <span className="rounded-xs bg-white/55" />
                <span className="rounded-xs bg-white/55" />
                <span className="rounded-xs bg-[#b8f23f]" />
              </span>
              All notes
              <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/75">
                {noteList.length}
              </span>
            </a>
            <a
              className="flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#777783] transition hover:bg-[#f4f3f8] hover:text-[#19191f] lg:w-full"
              href="#categories"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.75 6.75h6l2 2h8.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-13a2 2 0 0 1-2-2v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.75 8.75h16.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              Categories
            </a>
          </nav>

          <div className="mt-7 hidden lg:block">
            <div className="mb-3 flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a09faa]">
              <span>Your categories</span>
              <span>{categoryList.length}</span>
            </div>
            <nav
              className="max-h-[38vh] space-y-1 overflow-y-auto"
              aria-label="Your categories"
            >
              {categoryList.map((category, index) => (
                <a
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#696975] transition hover:bg-[#f4f3f8] hover:text-[#19191f]"
                  href={`#category-${category.id}`}
                  key={category.id}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-lg text-xs font-semibold ${index % 3 === 0 ? "bg-[#e8f8c9] text-[#577719]" : index % 3 === 1 ? "bg-[#e9e7f6] text-[#655a9d]" : "bg-[#fcebdc] text-[#a36a35]"}`}
                  >
                    {category.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="truncate">{category.name}</span>
                  <span className="ml-auto text-xs text-[#aaa9b2]">
                    {
                      noteList.filter(
                        (note) => note.category_id === category.id,
                      ).length
                    }
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#eeedf2] pt-4 lg:mt-auto">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e9e7f6] text-sm font-semibold text-[#625993]">
                {(user.email?.[0] ?? "U").toUpperCase()}
              </span>
              <span className="truncate text-xs text-[#777783]">
                {user.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
          <div className="mx-auto mt-7 w-full max-w-310">
            <section className="relative isolate overflow-hidden rounded-[28px] bg-[#15151b] px-6 py-7 text-white sm:px-9 sm:py-9 lg:px-11 lg:py-10">
              <div className="pointer-events-none absolute -right-12 -top-28 -z-10 size-80 rounded-full bg-[#b8f23f]/15 blur-3xl" />
              <div className="pointer-events-none absolute right-[13%] top-1/2 hidden size-40 -translate-y-1/2 rounded-full border border-white/10 sm:block" />
              <div className="pointer-events-none absolute right-[16%] top-1/2 hidden size-28 -translate-y-1/2 rounded-full border border-[#b8f23f]/50 sm:block" />
              <div className="relative max-w-2xl">
                <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[46px]">
                  Make room for your next big idea.
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/60 sm:text-base">
                  Keep class notes, quick thoughts, and sketches together. Pick
                  a category and carry on where you left off.
                </p>
                <a
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b8f23f] px-4 py-2.5 text-sm font-semibold text-[#202414] transition hover:bg-[#c8ff55]"
                  href="#categories"
                >
                  Explore categories
                  <span aria-hidden="true">↘</span>
                </a>
              </div>
              <div className="absolute bottom-8 right-9 hidden items-center gap-2 sm:flex">
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70">
                  Write
                </span>
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70">
                  Sketch
                </span>
                <span className="grid size-9 place-items-center rounded-full bg-[#b8f23f] text-lg text-[#202414]">
                  ✦
                </span>
              </div>
            </section>

            <section
              className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"
              aria-label="Workspace summary"
            >
              <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(36,35,50,0.03)] sm:p-5">
                <p className="text-xs text-[#92919c]">Categories</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {categoryList.length}
                </p>
                <p className="mt-1 text-xs text-[#a4a3ad]">
                  Your subjects and projects
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(36,35,50,0.03)] sm:p-5">
                <p className="text-xs text-[#92919c]">Notes</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {noteList.length}
                </p>
                <p className="mt-1 text-xs text-[#a4a3ad]">
                  Ideas saved so far
                </p>
              </div>
              <div className="col-span-2 flex items-center justify-between rounded-2xl bg-[#e8e7ef] p-4 sm:col-span-1 sm:block sm:p-5">
                <div>
                  <p className="text-xs text-[#92919c]">Your workspace</p>
                  <p className="mt-2 text-base font-semibold tracking-tight">
                    Synced to your account
                  </p>
                </div>
                <span
                  className="grid size-10 place-items-center rounded-full bg-[#b8f23f] text-lg text-[#25300f] sm:mt-3"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </section>

            <section className="mt-10" id="categories">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] sm:text-[28px]">
                    Categories
                  </h2>
                  <p className="mt-1 text-sm text-[#92919c]">
                    Everything has its own place.
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#777783]">
                  {categoryList.length}{" "}
                  {categoryList.length === 1 ? "category" : "categories"}
                </span>
              </div>

              {categoryList.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {categoryList.map((category, index) => {
                    const categoryNotes = noteList.filter(
                      (note) => note.category_id === category.id,
                    );
                    const tint = index % 3;

                    return (
                      <article
                        className="rounded-[22px] border border-white/80 bg-white p-5 shadow-[0_6px_26px_rgba(36,35,50,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,35,50,0.075)] sm:p-6"
                        id={`category-${category.id}`}
                        key={category.id}
                      >
                        <header className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3.5">
                            <span
                              className={`grid size-11 shrink-0 place-items-center rounded-[15px] text-sm font-semibold ${tint === 0 ? "bg-[#e8f8c9] text-[#577719]" : tint === 1 ? "bg-[#e9e7f6] text-[#655a9d]" : "bg-[#fcebdc] text-[#a36a35]"}`}
                            >
                              {category.name.slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <h3 className="truncate text-base font-semibold tracking-tight">
                                {category.name}
                              </h3>
                              <p className="mt-0.5 text-xs text-[#a09faa]">
                                {categoryNotes.length}{" "}
                                {categoryNotes.length === 1 ? "note" : "notes"}
                              </p>
                            </div>
                          </div>
                          <span
                            className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f4f3f8] text-[#777783]"
                            aria-hidden="true"
                          >
                            ↗
                          </span>
                        </header>

                        {categoryNotes.length > 0 ? (
                          <ul className="mt-5 space-y-1">
                            {categoryNotes.map((note) => (
                              <li key={note.id}>
                                <Link
                                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[#f6f5fa]"
                                  href={`/notes/${note.id}`}
                                >
                                  <span
                                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f1f0f6] text-[#858491] transition group-hover:bg-[#e8f8c9] group-hover:text-[#577719]"
                                    aria-hidden="true"
                                  >
                                    <svg
                                      className="size-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M7 3.75h7l4.25 4.5v11A1.75 1.75 0 0 1 16.5 21h-9A1.75 1.75 0 0 1 5.75 19.25v-13.75A1.75 1.75 0 0 1 7.5 3.75Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M13.75 4v4.5h4.1M9 12h6m-6 3.5h6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </span>
                                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#555560] group-hover:text-[#19191f]">
                                    {note.title}
                                  </span>
                                  <span
                                    className="text-[#b2b1ba] transition group-hover:translate-x-0.5 group-hover:text-[#19191f]"
                                    aria-hidden="true"
                                  >
                                    →
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-5 rounded-xl border border-dashed border-[#e7e6ed] px-4 py-5 text-center">
                            <p className="text-sm text-[#8f8e99]">
                              A fresh page, ready for your first note.
                            </p>
                          </div>
                        )}

                        <CreateNoteForm categoryId={category.id} />
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#d8d7e1] bg-white/60 px-6 py-12 text-center">
                  <span
                    className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e8f8c9] text-xl text-[#577719]"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <h3 className="mt-4 font-semibold">Start with a category</h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#8f8e99]">
                    Create a category for a class, project, or anything you want
                    to keep together.
                  </p>
                </div>
              )}

              <div
                className="mt-5 rounded-[22px] border border-[#e6e5ec] bg-white/75 p-4 sm:p-5"
                id="add-category"
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">Add a category</h3>
                  <p className="mt-0.5 text-xs text-[#9998a3]">
                    A category keeps related notes together.
                  </p>
                </div>
                <CreateCategoryForm />
              </div>
            </section>

            <footer className="mx-auto mt-10 max-w-[1240px] border-t border-[#e2e1e9] py-5 text-center text-xs text-[#a1a0aa]">
              A little space to think, wherever you are.
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
