
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];


function searchNotes(word) {
  const needle = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(needle));
}

console.log(searchNotes("milk"));


console.log(searchNotes("MILK"));


console.log(searchNotes("unicorn"));

function longestNote() {
  if (notes.length === 0) return null;

  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

console.log(longestNote());

const backup = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = backup; // restore


function countByCategory() {
  const counts = {};
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

console.log(countByCategory());

function getSummary() {
  const counts = countByCategory();
  const parts = Object.entries(counts).map(
    ([category, n]) => `${n} ${category}`
  );
  const total = notes.length;
  const noun = total === 1 ? "note" : "notes";
  return `${total} ${noun}: ${parts.join(", ")}.`;
}

console.log(getSummary());

const backup2 = notes;
notes = [{ id: 99, text: "Only one", category: "personal" }];
console.log(getSummary());

notes = backup2; // restore

function isDuplicate(text) {
  const normalise = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();
  const target = normalise(text);
  return notes.some((note) => normalise(note.text) === target);
}

console.log(isDuplicate("Buy milk and bread"));


console.log(isDuplicate("  buy   MILK   and bread  "));


console.log(isDuplicate("A brand new note"));

function addNote(text, category) {
  const allowed = ["personal", "work", "study"];

  if (typeof text !== "string" || text.trim().length < 1) {
    console.log("Rejected: text is empty.");
    return false;
  }
  if (text.length > 200) {
    console.log("Rejected: text exceeds 200 characters.");
    return false;
  }
  if (!allowed.includes(category)) {
    console.log(`Rejected: category "${category}" is not allowed.`);
    return false;
  }
  if (isDuplicate(text)) {
    console.log("Rejected: duplicate note.");
    return false;
  }

  const nextId = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  notes.push({ id: nextId, text: text.trim(), category });
  console.log(`Added: "${text.trim()}" (${category}).`);
  return true;
}

console.log(addNote("Buy eggs", "personal"));

console.log(addNote("Buy milk and bread", "personal"));

console.log(addNote("x".repeat(201), "work"));

console.log(addNote("A valid note", "hobby"));

console.log(addNote("", "work"));


console.log(notes);
