"use client";
import React, { useState } from "react";
import { useDictionary } from "../lib/useDictionary";
import { solve } from "../lib/solver";
import Result from "./Result";

const ALGORITHMS = [
  { id: "ucs", num: "i", label: "UCS", hint: "Uniform cost. Optimal, patient." },
  { id: "gbfs", num: "ii", label: "Greedy BFS", hint: "Heuristic only. Fast, sometimes wrong." },
  { id: "astar", num: "iii", label: "A*", hint: "Cost + heuristic. Best of both." },
];

function SectionHeading({ num, children }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="font-mono text-xs text-vermillion tracking-[0.2em]">
        § {num}
      </span>
      <h2 className="font-serif italic text-2xl text-ink">{children}</h2>
      <div className="flex-1 border-b border-dotted hairline mb-1" />
    </div>
  );
}

function WordField({ id, label, value, onChange, placeholder }) {
  return (
    <label htmlFor={id} className="block">
      <div className="flex justify-between items-baseline">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          {label}
        </span>
        <span className="font-mono text-[11px] text-ink-soft tabular-nums">
          {value.length > 0 ? `${value.length} char${value.length === 1 ? "" : "s"}` : "—"}
        </span>
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z]/g, ""))}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        required
        className="mt-1 w-full bg-transparent border-0 border-b-2 border-ink font-mono text-3xl sm:text-4xl uppercase tracking-wider py-2 focus:outline-none focus:border-vermillion placeholder:text-paper-dim text-ink caret-vermillion"
      />
    </label>
  );
}

function AlgorithmPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {ALGORITHMS.map((a) => {
        const selected = value === a.id;
        return (
          <label
            key={a.id}
            className={`relative cursor-pointer border-2 border-ink p-4 transition-all block ${
              selected
                ? "bg-vermillion text-paper -translate-y-0.5 shadow-block"
                : "bg-paper text-ink hover:-translate-y-0.5 hover:shadow-block-sm"
            }`}
          >
            <input
              type="radio"
              name="algorithm"
              value={a.id}
              checked={selected}
              onChange={() => onChange(a.id)}
              className="sr-only"
            />
            <div className="flex items-baseline justify-between">
              <span className="font-serif italic text-xl">{a.label}</span>
              <span className="font-mono text-[10px] tracking-widest opacity-70">
                {a.num}
              </span>
            </div>
            <p className={`mt-2 text-xs ${selected ? "text-paper/90" : "text-ink-soft"}`}>
              {a.hint}
            </p>
          </label>
        );
      })}
    </div>
  );
}

export default function Input() {
  const [startWord, setStartWord] = useState("");
  const [goalWord, setGoalWord] = useState("");
  const [algorithm, setAlgorithm] = useState("ucs");
  const [result, setResult] = useState(null);
  const { dictionary, error: dictError, ready } = useDictionary();

  const lengthMismatch =
    startWord.length > 0 && goalWord.length > 0 && startWord.length !== goalWord.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ready || lengthMismatch) return;

    const start = startWord.trim().toLowerCase();
    const end = goalWord.trim().toLowerCase();

    setResult({ status: "loading" });
    setTimeout(() => {
      const res = solve(dictionary, start, end, algorithm);
      if (res.error) {
        setResult({
          status: "error",
          message: res.error,
          visited: res.visited,
          elapsedMs: res.elapsedMs,
        });
      } else {
        setResult({
          status: "success",
          path: res.path,
          visited: res.visited,
          elapsedMs: res.elapsedMs,
          algorithm,
        });
      }
    }, 20);
  };

  return (
    <div className="space-y-14">
      <form onSubmit={handleSubmit} className="space-y-12">
        <section>
          <SectionHeading num="I">the words</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <WordField
              id="start"
              label="Start"
              value={startWord}
              onChange={setStartWord}
              placeholder="COLD"
            />
            <WordField
              id="goal"
              label="Goal"
              value={goalWord}
              onChange={setGoalWord}
              placeholder="WARM"
            />
          </div>
          {lengthMismatch && (
            <p className="mt-4 font-mono text-xs text-vermillion">
              × length mismatch — {startWord.length} vs {goalWord.length}. Pick words of equal length.
            </p>
          )}
        </section>

        <section>
          <SectionHeading num="II">the method</SectionHeading>
          <AlgorithmPicker value={algorithm} onChange={setAlgorithm} />
        </section>

        <div>
          <button
            type="submit"
            disabled={!ready || lengthMismatch}
            className="group w-full border-2 border-ink bg-ink text-paper font-serif italic text-2xl py-4 px-6 flex items-center justify-between transition-all hover:bg-vermillion hover:-translate-x-1 hover:-translate-y-1 hover:shadow-block disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-ink"
          >
            <span>{!ready ? "loading dictionary…" : "climb the ladder"}</span>
            <span className="font-mono text-sm not-italic tracking-[0.2em] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
          {dictError && (
            <p className="mt-3 font-mono text-xs text-vermillion">{dictError}</p>
          )}
        </div>
      </form>

      {result && (
        <section>
          <SectionHeading num="III">the result</SectionHeading>
          <Result state={result} />
        </section>
      )}
    </div>
  );
}
