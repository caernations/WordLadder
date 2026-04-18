"use client";
import { useEffect, useState } from "react";

let cachedPromise = null;

function loadDictionary() {
  if (!cachedPromise) {
    cachedPromise = fetch("/words.txt")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load dictionary (${r.status})`);
        return r.text();
      })
      .then((text) => {
        const set = new Set();
        for (const line of text.split(/\r?\n/)) {
          const w = line.trim().toLowerCase();
          if (w) set.add(w);
        }
        return set;
      })
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });
  }
  return cachedPromise;
}

export function useDictionary() {
  const [dictionary, setDictionary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadDictionary()
      .then((set) => mounted && setDictionary(set))
      .catch((e) => mounted && setError(e.message));
    return () => {
      mounted = false;
    };
  }, []);

  return { dictionary, error, ready: dictionary !== null };
}
