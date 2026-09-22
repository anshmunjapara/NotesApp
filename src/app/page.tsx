const notes = [
  { title: "Welcome to your notes", preview: "A small place for big ideas.", updated: "Just now" },
  { title: "Ideas to explore", preview: "Collect thoughts, sketches, and links here.", updated: "Yesterday" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#252525]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-[#e5e3dd] px-6 py-6 lg:w-72 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b897f]">Notes</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">Your thinking space</h1>
            </div>
            <button className="rounded-full bg-[#252525] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#454545] lg:mt-8" type="button">
              + New note
            </button>
          </div>
          <nav className="mt-10 hidden space-y-2 lg:block" aria-label="Main navigation">
            <a className="block rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm" href="#notes">All notes</a>
            <a className="block rounded-xl px-4 py-3 text-sm text-[#77746b] transition hover:bg-white" href="#canvas">Canvas</a>
          </nav>
        </aside>

        <section className="flex-1 px-6 py-8 lg:px-14 lg:py-12" id="notes">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#8b897f]">Monday, September 21</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">All notes</h2>
            </div>
            <span className="hidden rounded-full border border-[#dedcd5] px-3 py-1 text-xs text-[#8b897f] sm:inline-block">2 notes</span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <article className="min-h-48 rounded-2xl border border-[#e5e3dd] bg-white p-6 shadow-[0_8px_30px_rgba(36,35,31,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,35,31,0.08)]" key={note.title}>
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#77746b]">{note.preview}</p>
                  </div>
                  <p className="text-xs text-[#aaa79e]">Updated {note.updated}</p>
                </div>
              </article>
            ))}
            <article className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-[#cbc8bf] bg-transparent p-6 text-center" id="canvas">
              <div>
                <p className="text-3xl">✦</p>
                <h3 className="mt-3 font-medium">Your canvas is waiting</h3>
                <p className="mt-1 text-sm text-[#8b897f]">We&apos;ll add a visual canvas in a later step.</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
