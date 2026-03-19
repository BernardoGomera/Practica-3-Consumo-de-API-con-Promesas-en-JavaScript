const API_URL = "https://jsonplaceholder.typicode.com/users";
const dominicanPrefixes = ["809", "829", "849", "849", "809"];

const loadButton = document.getElementById("loadButton");
const searchInput = document.getElementById("searchInput");
const userGrid = document.getElementById("userGrid");
const loader = document.getElementById("loader");

let cachedUsers = [];

const toggleLoader = (show) => {
  loader.hidden = !show;
};

const formatDominicanPhone = (rawPhone) => {
  const digits = rawPhone.replace(/\D+/g, "");
  const suffix = digits.slice(-7).padStart(7, "0");
  const prefix = dominicanPrefixes[Math.floor(Math.random() * dominicanPrefixes.length)];
  return `${prefix}-${suffix.slice(0, 3)}-${suffix.slice(3)}`;
};

const buildUserCard = (user) => {
  const article = document.createElement("article");
  article.className = "user-card";

  article.innerHTML = `
    <h2>${user.name}</h2>
    <p><span class="label">Email</span><strong>${user.email}</strong></p>
    <p><span class="label">Ciudad</span>${user.address.city}</p>
    <p><span class="label">Empresa</span>${user.company.name}</p>
    <p><span class="label">Teléfono</span>${formatDominicanPhone(user.phone)}</p>
    <p><span class="label">Website</span><a href="https://${user.website}" target="_blank" rel="noreferrer">${user.website}</a></p>
  `;

  return article;
};

const renderUsers = (users) => {
  userGrid.innerHTML = "";

  if (!users.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No hay usuarios que coincidan con el filtro.";
    userGrid.appendChild(empty);
    return;
  }

  users.forEach((user) => {
    userGrid.appendChild(buildUserCard(user));
  });
};

const filterUsers = () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = cachedUsers.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filtered);
};

const loadUsers = () => {
  toggleLoader(true);
  loadButton.disabled = true;

  searchInput.value = "";

  // Una promesa representa un valor que estará disponible en el futuro; fetch() inicia la petición HTTP y devuelve una promesa con la respuesta.
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      return response.json();
    })
    .then((users) => {
      cachedUsers = users;
      renderUsers(users);
    })
    .catch((error) => {
      const errorCard = document.createElement("p");
      errorCard.className = "error";
      errorCard.textContent = `No se pudieron cargar los usuarios: ${error.message}`;
      userGrid.innerHTML = "";
      userGrid.appendChild(errorCard);

      // Aquí explicamos cómo se manejan los errores en JavaScript: .catch captura cualquier excepción de la promesa.
    })
    .finally(() => {
      toggleLoader(false);
      loadButton.disabled = false;
    });
};

loadButton.addEventListener("click", loadUsers);
searchInput.addEventListener("input", () => {
  if (!cachedUsers.length) {
    return;
  }
  filterUsers();
});
