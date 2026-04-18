import Input from "./components/Input";

export default function Home() {
  return (
    <main className="min-h-screen grain">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-10 pb-24">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-ink-soft">
          <span>Word&nbsp;Ladder · N&deg; 01</span>
          <span>IF2211 / 13522140</span>
        </div>
        <div className="border-t border-ink mt-3" />

        <header className="mt-10 mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-vermillion mb-4">
            ↘ A puzzle by Lewis Carroll, 1877
          </div>
          <h1 className="font-serif text-6xl sm:text-8xl leading-[0.9] text-ink">
            Word{" "}
            <span className="italic">Ladder</span>
            <span className="text-vermillion">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-ink-soft text-lg leading-relaxed">
            Change one letter at a time to climb from{" "}
            <em className="font-serif text-ink">start</em> to{" "}
            <em className="font-serif text-ink">goal</em>. Every rung must be a
            real word. Three search strategies race to find the shortest route.
          </p>
        </header>

        <Input />

        <footer className="mt-20 pt-5 border-t border-ink text-[11px] font-mono uppercase tracking-[0.2em] text-ink-soft flex justify-between">
          <span>80,368 entries · offline</span>
          <span>UCS · GBFS · A&#42;</span>
        </footer>
      </div>
    </main>
  );
}
