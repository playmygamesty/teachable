/**
 * Emoji‑mode reply: map known words → emoji.
 */
export function replyEmoji(userMsg, state) {
  const tokens = userMsg.toLowerCase().match(/\b\w+\b/g) || [];
  const mapped = tokens.map(t => findEmoji(t, state.lexicon) || "❓");
  // If we mapped at least one known emoji, great; otherwise shrug
  return mapped.every(e => e === "❓") ? "🤷" : mapped.join(" ");
}

function findEmoji(word, lexicon) {
  for (const [emoji, w] of Object.entries(lexicon)) if (w === word) return emoji;
  return null;
}

/** Manual add */
export function addTeachingPair(emoji, word, state) {
  if (!emoji || !word) return;
  state.lexicon[emoji] = word.toLowerCase();
}

/**
 * 🔥 NEW ➜ learn implicitly from conversation.
 * If a message contains exactly 1 unknown emoji + 1 unknown word, pair them.
 * Returns {emoji, word} when it actually learns something.
 */
export function autoLearn(userMsg, state) {
  const emojiMatches = [...userMsg.matchAll(/\p{Emoji_Presentation}/gu)].map(m => m[0]);
  if (emojiMatches.length !== 1) return null;
  const emoji = emojiMatches[0];
  if (state.lexicon[emoji]) return null; // already known

  const words = userMsg.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  // pick the first word that isn't already mapped
  const unknownWord = words.find(w => !Object.values(state.lexicon).includes(w));
  if (!unknownWord) return null;

  state.lexicon[emoji] = unknownWord;
  return { emoji, word: unknownWord };
}
