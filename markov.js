// Build a second-order Markov chain from sentence lines
export function buildMarkovTable(lines) {
  const table = {};
  lines.forEach(l => {
    const words = ["⟨START⟩", "⟨START⟩", ...l.trim().split(/\s+/), "⟨END⟩"];
    for (let i = 0; i < words.length - 2; i++) {
      const key = words[i] + " " + words[i + 1];
      if (!table[key]) table[key] = [];
      table[key].push(words[i + 2]);
    }
  });
  return table;
}

// Generate a sentence from the table
export function generateSentence(table, max = 20) {
  let w1 = "⟨START⟩";
  let w2 = "⟨START⟩";
  const out = [];

  for (let i = 0; i < max; i++) {
    const key = w1 + " " + w2;
    const next = random(table[key]);
    if (!next || next === "⟨END⟩") break;
    out.push(next);
    [w1, w2] = [w2, next];
  }

  return out.length > 0 ? out.join(" ") : "🤖 (still learning!)";
}

// Random utility function
function random(arr) {
  return arr?.[Math.floor(Math.random() * arr.length)];
}
