/**
 * Emoji‑mode reply: map known words → emoji.
 */
export function replyEmoji(userMsg, state) {
  const tokens = userMsg.toLowerCase().match(/\b\w+\b/g) || [];
  const mapped = tokens.map(t => findEmoji(t, state.lexicon) || "❓");
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
 * Advanced implicit learning:
 * – Collect all unknown emojis in the message
 * – Collect all unknown words (alphabetic tokens length ≥ 3)
 * – Pair them in appearance order (one‑to‑one) and save
 * Returns an array of {emoji, word} actually learned.
 */
export function autoLearn(userMsg, state) {
  const learned = [];

  // Ordered lists of emojis and words in the message
  const emojiMatches = [...userMsg.matchAll(/\p{Emoji_Presentation}/gu)].map(m => m[0]);
  const wordMatches  = userMsg.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

  if (!emojiMatches.length || !wordMatches.length) return learned;

  const unknownEmojis = emojiMatches.filter(e => !state.lexicon[e]);
  const knownWords = new Set(Object.values(state.lexicon));
  const unknownWords = wordMatches.filter(w => !knownWords.has(w));

  const count = Math.min(unknownEmojis.length, unknownWords.length);
  for (let i = 0; i < count; i++) {
    const emoji = unknownEmojis[i];
    const word  = unknownWords[i];
    state.lexicon[emoji] = word;
    learned.push({ emoji, word });
  }

  return learned;
}
