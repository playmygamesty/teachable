export function buildMarkovTable(lines) {
  const table = {};
  lines.forEach(line => {
    const words = ["⟨START⟩", ...line.split(/\s+/), "⟨END⟩"];
    for (let i = 0; i < words.length - 2; i++) {
      const key = words[i] + " " + words[i + 1];
      (table[key] ||= []).push(words[i + 2]);
    }
  });
  return table;
}

export function generateSentence(table, max = 20) {
  let w1 = "⟨START⟩";
  let w2 = Object.keys(table).find(k => k.startsWith("⟨START⟩"))?.split(" ")[1] || "";
  const out = [];

  while (out.length < max) {
    const key = w1 + " " + w2;
    const next = pick(table[key]);
    if (!next || next === "⟨END⟩") break;
    out.push(next);
    [w1, w2] = [w2, next];
  }

  return out.join(" ");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
