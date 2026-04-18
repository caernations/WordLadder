class MinHeap {
  constructor(keyFn) {
    this.heap = [];
    this.keyFn = keyFn;
  }
  get size() {
    return this.heap.length;
  }
  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }
  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  _bubbleUp(i) {
    const item = this.heap[i];
    const key = this.keyFn(item);
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.keyFn(this.heap[parent]) <= key) break;
      this.heap[i] = this.heap[parent];
      i = parent;
    }
    this.heap[i] = item;
  }
  _sinkDown(i) {
    const n = this.heap.length;
    const item = this.heap[i];
    const key = this.keyFn(item);
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      let smallestKey = key;
      if (l < n && this.keyFn(this.heap[l]) < smallestKey) {
        smallest = l;
        smallestKey = this.keyFn(this.heap[l]);
      }
      if (r < n && this.keyFn(this.heap[r]) < smallestKey) {
        smallest = r;
      }
      if (smallest === i) break;
      this.heap[i] = this.heap[smallest];
      i = smallest;
    }
    this.heap[i] = item;
  }
}

function heuristic(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

function neighborsOf(word, dictionary) {
  const out = [];
  const chars = word.split("");
  for (let i = 0; i < chars.length; i++) {
    const old = chars[i];
    for (let c = 97; c <= 122; c++) {
      const ch = String.fromCharCode(c);
      if (ch === old) continue;
      chars[i] = ch;
      const w = chars.join("");
      if (dictionary.has(w)) out.push(w);
    }
    chars[i] = old;
  }
  return out;
}

function reconstruct(node) {
  const path = [];
  while (node) {
    path.unshift(node.word);
    node = node.parent;
  }
  return path;
}

export function ucs(dictionary, start, end) {
  const frontier = new MinHeap((n) => n.cost);
  const visited = new Map();
  frontier.push({ word: start, parent: null, cost: 0 });
  let totalVisited = 0;

  while (frontier.size > 0) {
    const current = frontier.pop();
    totalVisited++;
    if (current.word === end) return { path: reconstruct(current), visited: totalVisited };
    for (const n of neighborsOf(current.word, dictionary)) {
      const next = current.cost + 1;
      if (!visited.has(n) || visited.get(n) > next) {
        visited.set(n, next);
        frontier.push({ word: n, parent: current, cost: next });
      }
    }
  }
  return { path: null, visited: totalVisited };
}

export function gbfs(dictionary, start, end) {
  const frontier = new MinHeap((n) => n.h);
  const visited = new Map();
  const allVisited = new Set();
  frontier.push({ word: start, parent: null, h: heuristic(start, end) });
  allVisited.add(start);

  while (frontier.size > 0) {
    const current = frontier.pop();
    if (current.word === end) return { path: reconstruct(current), visited: allVisited.size };
    if (!visited.has(current.word) || visited.get(current.word) > current.h) {
      visited.set(current.word, current.h);
      for (const n of neighborsOf(current.word, dictionary)) {
        const h = heuristic(n, end);
        if (!visited.has(n) || visited.get(n) > h) {
          frontier.push({ word: n, parent: current, h });
          allVisited.add(n);
        }
      }
    }
  }
  return { path: null, visited: allVisited.size };
}

export function aStar(dictionary, start, end) {
  const frontier = new MinHeap((n) => n.f);
  const gScore = new Map([[start, 0]]);
  const allVisited = new Set([start]);
  frontier.push({ word: start, parent: null, g: 0, f: heuristic(start, end) });

  while (frontier.size > 0) {
    const current = frontier.pop();
    if (current.word === end) return { path: reconstruct(current), visited: allVisited.size };
    for (const n of neighborsOf(current.word, dictionary)) {
      allVisited.add(n);
      const tentative = gScore.get(current.word) + 1;
      if (!gScore.has(n) || tentative < gScore.get(n)) {
        gScore.set(n, tentative);
        frontier.push({ word: n, parent: current, g: tentative, f: tentative + heuristic(n, end) });
      }
    }
  }
  return { path: null, visited: allVisited.size };
}

export function solve(dictionary, start, end, algorithm) {
  if (start.length !== end.length) {
    return { error: "Start and goal must have the same length." };
  }
  if (!dictionary.has(start)) return { error: `"${start}" is not in the dictionary.` };
  if (!dictionary.has(end)) return { error: `"${end}" is not in the dictionary.` };
  if (start === end) return { path: [start], visited: 1, elapsedMs: 0 };

  const t0 = performance.now();
  let result;
  if (algorithm === "ucs") result = ucs(dictionary, start, end);
  else if (algorithm === "gbfs") result = gbfs(dictionary, start, end);
  else result = aStar(dictionary, start, end);
  const elapsedMs = performance.now() - t0;

  if (!result.path) return { error: "No path found between those words.", visited: result.visited, elapsedMs };
  return { path: result.path, visited: result.visited, elapsedMs };
}
