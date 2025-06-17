import { replyEmoji, addTeachingPair, autoLearn } from './bot-core.js';
import { buildMarkovTable, generateSentence } from './markov.js';
import { loadState, saveState, resetState } from './settings.js';

const WORD_THRESHOLD = 10;
const CORPUS_THRESHOLD = 20;

// DOM refs
const chat = document.getElementById('chatWindow');
const input = document.getElementById('chatInput');
const form = document.getElementById('chatForm');
const settingsBtn = document.getElementById('settingsBtn');
const settingsDialog = document.getElementById('settingsDialog');
const modeDisplay = document.getElementById('modeDisplay');
const wordCount = document.getElementById('wordCount');
const corpusCount = document.getElementById('corpusCount');

// Teach form inside dialog
const teachForm = document.getElementById('teachForm');
const emojiInput = document.getElementById('emojiInput');
const wordInput  = document.getElementById('wordInput');

// Load state
const state = loadState();
renderStats();

// === Chat submit ===
form.onsubmit = e => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  addBubble(msg, 'user');
  input.value = '';

  // Auto‑learn mapping if possible
  const learned = autoLearn(msg, state);
  if (learned) addBubble(`👍 Learned: ${learned.emoji} = ${learned.word}`, 'bot');

  // Always store sentence for Markov
  state.corpus.push(msg);

  // Generate reply
  const reply = state.mode === 'emoji'
    ? replyEmoji(msg, state)
    : generateSentence(buildMarkovTable(state.corpus));
  addBubble(reply, 'bot');

  checkModeSwitch();
  saveState(state);
};

// === Manual teach inside settings dialog ===
teachForm.onsubmit = e => {
  e.preventDefault();
  addTeachingPair(emojiInput.value, wordInput.value, state);
  addBubble(`📚 Learned: ${emojiInput.value} = ${wordInput.value}`, 'bot');
  emojiInput.value = wordInput.value = '';
  checkModeSwitch();
  saveState(state);
};

// === Helpers ===
function addBubble(text, who = 'bot') {
  const div = document.createElement('div');
  div.className = `chat-bubble ${who}`;
  div.textContent = `${who === 'bot' ? '🤖' : '🙂'} ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function checkModeSwitch() {
  const known = Object.keys(state.lexicon).length;
  const cor = state.corpus.length;
  if (state.mode === 'emoji' && known >= WORD_THRESHOLD && cor >= CORPUS_THRESHOLD) {
    state.mode = 'text';
    addBubble('🎉 I can talk now!', 'bot');
  }
  renderStats();
}

function renderStats() {
  modeDisplay.textContent = state.mode;
  wordCount.textContent = Object.keys(state.lexicon).length;
  corpusCount.textContent = state.corpus.length;
}

// === Settings dialog & reset ===
settingsBtn.onclick = () => settingsDialog.showModal();

document.getElementById('resetBtn').onclick = resetState;
