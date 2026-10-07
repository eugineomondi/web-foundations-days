// ---------- Element references ----------
const loadBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const status = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

// ---------- State ----------
const API_URL = "https://jsonplaceholder.typicode.com/users";
let users = [];

// ---------- Helpers ----------
function setStatus(message, isError = false) {
  status.textContent = message;
  status.style.color = isError ? "crimson" : "";
}

function renderUsers(list) {
  usersList.textContent = "";

  if (list.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No users match your filter.";
    usersList.appendChild(li);
    return;
  }

  for (const user of list) {
    const li = document.createElement("li");

    const name = document.createElement("h3");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = user.email;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(city);
    li.appendChild(company);
    usersList.appendChild(li);
  }
}

// ---------- Load users ----------
async function loadUsers() {
  loadBtn.disabled = true;
  setStatus("Loading...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    users = await response.json();
    renderUsers(users);
    setStatus(`Loaded ${users.length} users.`);
  } catch (error) {
    users = [];
    usersList.textContent = "";
    setStatus(`Error: ${error.message}`, true);
  } finally {
    loadBtn.disabled = false;
  }
}

// ---------- Filter (no new request) ----------
filterInput.addEventListener("input", () => {
  const query = filterInput.value.trim().toLowerCase();

  if (query === "") {
    renderUsers(users);
    return;
  }

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filtered);
});

// ---------- Button ----------
loadBtn.addEventListener("click", loadUsers);