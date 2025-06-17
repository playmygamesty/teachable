export function loadState() {
  try {
    return JSON.parse(localStorage.getItem("emojiBotState")) || {
      lexicon: {}, corpus: [], mode: "emoji"
    };
  } catch (_) {
    return { lexicon: {}, corpus: [], mode: "emoji" };
  }
}

export const saveState = state =>
  localStorage.setItem("emojiBotState", JSON.stringify(state));

export const resetState = () => {
  localStorage.removeItem("emojiBotState");
  location.reload();
};
