export function saveState(state) {
  localStorage.setItem("emojiBotState", JSON.stringify(state));
}

export function loadState() {
  const raw = localStorage.getItem("emojiBotState");
  return raw ? JSON.parse(raw) : {
    lexicon: {},
    corpus: [],
    mode: "emoji"
  };
}

export function resetState() {
  localStorage.removeItem("emojiBotState");
  location.reload();
}
