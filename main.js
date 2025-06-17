import { replyEmoji, addTeachingPair } from './bot-core.js';
import { buildMarkovTable, generateSentence } from './markov.js';
import { loadState, saveState, resetState } from './settings.js';

const WORD_THRESHOLD = 5;
const CORPUS_THRESHOLD = 10;

const chat = document.getElementById('chatWindow');
const input = document.getElementById('chatInput');
const form = document.getElementById('chatForm');

const modeDisplay = document.getElementById('modeDisplay');
const wordCount = document.getElementById('wordCount');
const corpusCount = document.getElementById('corpusCount');
const settingsDialog = document.getElementById('settingsDialog');

const state = loadState();
updateSettingsPanel();

form.onsubmit = e => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  print(msg, 'user');

  if (msg.startsWith("teach ")) {
    const [_, emoji, word] = msg.split(" ");
    if (emoji && word) {
      addTeachingPair(emoji, word, state);
      print(`Got it! ${emoji} means "${word}".`, 'bot');
    }
  } else {
    let reply = "";
    if (state.mode === "emoji") {
      reply = replyEmoji(msg, state);
    } else {
      const table = buildMarkovTable(state.corpus);
      reply = generateSentence(table);
    }
    print(reply, 'bot');
  }

  input.value = "";
  updateMode();
  saveState(state);
};

function print(text, who = 'bot') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${who}`;
  bubble.textContent = `${who === 'bot' ? "🤖" : "🙂"} ${text}`;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function updateMode() {
  const lex = Object.keys(state.lexicon).length;
  const cor = state.corpus.length;
  if (lex >= WORD_THRESHOLD && cor >= CORPUS_THRESHOLD) {
    if (state.mode !== "text") {
      state.mode = "text";
      print("🎉 I can talk now!", 'bot');
    }
  }
  updateSettingsPanel();
}

function updateSettingsPanel() {
  modeDisplay.textContent = state.mode;
  wordCount.textContent = Object.keys(state.lexicon).length;
  corpusCount.textContent = state.corpus.length;
}

document.getElementById("settingsBtn").onclick = () => settingsDialog.showModal();
document.getElementById("resetBtn").onclick = () => resetState();
document.getElementById("teachForm").onsubmit = e => {
  e.preventDefault();
  const emoji = document.getElementById("emojiInput").value;
  const word = document.getElementById("wordInput").value;
  if (emoji && word) {
    addTeachingPair(emoji, word, state);
    print(`👍 Learned: ${emoji} = ${word}`, 'bot');
    document.getElementById("emojiInput").value = "";
    document.getElementById("wordInput").value = "";
    updateMode();
    saveState(state);
  }
};
