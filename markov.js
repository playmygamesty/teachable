export function buildMarkovTable(lines) {
  const table = {};
  lines.forEach(l => {
    const words = ["⟨START⟩", ...l.split(/\s+/), "⟨END⟩"];
    for (let i = 0; i < words.length - 2; i++) {
      const key = words[i] + " " + words[i + 1];
      (table[key] ||= []).push(words[i + 2]);
    }
  });
  return table;
  
}
export function generateSentence(table, max = 20) {
  let w1 = "⟨START⟩";
  let w2 = random(table["⟨START⟩ ⟨START⟩"] || Object.keys(table)[0]?.split(" ")[1]);
  const out = [];
  while (out.length < max) {
    const next = random(table[w1 + " " + w2]);
    if (!next || next === "⟨END⟩") break;
    out.push(next);
    [w1, w2] = [w2, next];
  }
  return out.length > 0 ? out.join(" ") : "🤖";  // fallback if empty
}


function random(arr) { return arr?.[Math.floor(Math.random() * arr.length)]; }
