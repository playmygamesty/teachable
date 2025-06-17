export function replyEmoji(userMsg, state) {
  const tokens = userMsg.toLowerCase().match(/\b\w+\b/g) || [];
  state.corpus.push(userMsg);

  const out = tokens.map(t => findEmoji(t, state.lexicon) || "❓");
  return out.every(e => e === "❓") ? "🤷" : out.join(" ");
}

function findEmoji(word, lexicon) {
  for (const [emoji, w] of Object.entries(lexicon)) {
    if (w === word) return emoji;
  }
  return null;
}

export function addTeachingPair(emoji, word, state) {
  state.lexicon[emoji] = word.toLowerCase();
}
