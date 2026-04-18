import React from "react";

function LetterTile({ ch, variant }) {
  const base =
    "w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center font-mono font-semibold text-xl sm:text-2xl uppercase border-2 border-ink";
  const styles = {
    plain: "bg-paper text-ink",
    changed: "bg-vermillion text-paper",
    endpoint: "bg-moss text-paper",
  };
  return <div className={`${base} ${styles[variant]}`}>{ch}</div>;
}

function WordRow({ word, prev, isEndpoint }) {
  const letters = word.split("");
  return (
    <div className="flex gap-1.5 justify-center">
      {letters.map((ch, i) => {
        const changed = prev && prev[i] !== ch;
        const variant = isEndpoint ? "endpoint" : changed ? "changed" : "plain";
        return <LetterTile key={i} ch={ch} variant={variant} />;
      })}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex-1 border-2 border-ink bg-paper p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </div>
      <div
        className={`mt-2 font-serif text-3xl tabular-nums ${
          accent ? "text-vermillion italic" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Rung() {
  return (
    <div className="flex justify-center my-1">
      <div className="w-0.5 h-4 bg-ink" />
    </div>
  );
}

export default function Result({ state }) {
  if (!state) return null;

  if (state.status === "loading") {
    return (
      <div className="border-2 border-ink bg-paper p-8">
        <div className="font-mono text-sm text-ink caret-blink">searching</div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="border-2 border-vermillion bg-paper p-6 shadow-block-vermillion">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion">
            × halt
          </span>
          <div className="h-px flex-1 bg-vermillion mt-auto mb-1" />
        </div>
        <div className="mt-3 font-serif italic text-2xl text-ink">
          {state.message}
        </div>
        {state.visited != null && (
          <div className="mt-4 font-mono text-[11px] text-ink-soft uppercase tracking-wider">
            explored {state.visited.toLocaleString()} nodes ·{" "}
            {state.elapsedMs?.toFixed(1)}&thinsp;ms
          </div>
        )}
      </div>
    );
  }

  const { path, visited, elapsedMs, algorithm } = state;
  const algoLabel = { ucs: "UCS", gbfs: "Greedy BFS", astar: "A*" }[algorithm] ?? algorithm;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          solved by{" "}
          <span className="text-vermillion">{algoLabel}</span>
        </div>
        <div className="font-serif italic text-ink-soft">
          {path.length - 1} rung{path.length - 1 === 1 ? "" : "s"}
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <Stat label="Steps" value={path.length - 1} accent />
        <Stat label="Visited" value={visited.toLocaleString()} />
        <Stat label="Time" value={`${elapsedMs.toFixed(1)}ms`} />
      </div>

      <div className="border-2 border-ink bg-paper p-6 sm:p-8 relative overflow-x-auto">
        <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          the ladder ↓
        </div>
        <div className="pt-4">
          {path.map((word, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Rung />}
              <WordRow
                word={word}
                prev={i > 0 ? path[i - 1] : null}
                isEndpoint={i === 0 || i === path.length - 1}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
