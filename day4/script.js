// ---------- Element references ----------
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// ---------- Keys ----------
const DRAFT_KEY = "quicknotes.draft";
const THEME_KEY = "quicknotes.theme";
const MAX_CHARS = 200;
const WARN_AT = 180;

// ---------- Counters + warnings ----------
function updateCounts() {
  const text = textarea.value;
  const chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${chars} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

  charCount.classList.toggle("warning", chars > WARN_AT && chars <= MAX_CHARS);
  charCount.classList.toggle("over", chars > MAX_CHARS);
}

// ---------- Draft persistence ----------
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, textarea.value);
}

function loadDraft() {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved) textarea.value = saved;
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

// ---------- Clear ----------
function clearAll() {
  textarea.value = "";
  clearDraft();
  updateCounts();
  textarea.focus();
}

clearBtn.addEventListener("click", clearAll);

// Escape inside the textarea clears it
textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
  }
});

// ---------- Input event ----------
textarea.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

// ---------- Theme ----------
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark mode";
  }
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// ---------- Boot ----------
loadDraft();
applyTheme(localStorage.getItem(THEME_KEY) || "light");
updateCounts();