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
 * Improved implicit learning:
 * For each unknown emoji in the message,
 * find the nearest preceding unknown word (≥3 letters),
 * pair and learn.
 * Returns array of {emoji, word} learned.
 */
export function autoLearn(userMsg, state) {
  const learned = [];

  const words = [...userMsg.matchAll(/\b[a-z]{3,}\b/gi)];
  const emojis = [...userMsg.matchAll(/\p{Emoji_Presentation}/gu)];

  for (const emojiMatch of emojis) {
    const emoji = emojiMatch[0];
    if (state.lexicon[emoji]) continue; // already known

    // Find nearest word before emoji
    const emojiIndex = emojiMatch.index;
    const nearbyWord = [...words]
      .filter(w => w.index < emojiIndex)
      .pop();

    if (nearbyWord) {
      const word = nearbyWord[0].toLowerCase();
      if (!Object.values(state.lexicon).includes(word)) {
        state.lexicon[emoji] = word;
        learned.push({ emoji, word });
      }
    }
  }

  return learned;
}
