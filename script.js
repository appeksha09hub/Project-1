let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
const recipesPerPage = 6;
let currentPage = 1;

function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function renderRecipes(filtered = recipes) {
  const list = document.getElementById('recipe-list');
  const start = (currentPage - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  const paginatedRecipes = filtered.slice(start, end);

  list.innerHTML = '';
  paginatedRecipes.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <h3>${recipe.name}</h3>
      <small><strong>Tag:</strong> ${recipe.category} | ${recipe.type}</small>
      <img src="${recipe.image}" />
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
      <div class="card-actions">
        <button onclick="editRecipe(${recipes.indexOf(recipe)})">✏️ Edit</button>
        <button onclick="deleteRecipe(${recipes.indexOf(recipe)})">🗑️ Delete</button>
      </div>
    `;
    list.appendChild(card);
  });

  renderPagination(filtered.length);
}

function renderPagination(totalRecipes) {
  const controls = document.getElementById('pagination-controls');
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);
  controls.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.style.fontWeight = 'bold';
    btn.onclick = () => {
      currentPage = i;
      applyFilters();
    };
    controls.appendChild(btn);
  }
}

function showSection(id) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'home-section') applyFilters();
}

document.getElementById('recipe-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('recipe-name').value.trim();
  const ingredients = document.getElementById('ingredients').value.trim();
  const steps = document.getElementById('steps').value.trim();
  const category = document.getElementById('category').value.trim();
  const type = document.getElementById('type').value;
  const imageInput = document.getElementById('image');

  if (!name || !ingredients || !steps || !category || !type || !imageInput.files[0]) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const newRecipe = { name, ingredients, steps, image: event.target.result, category, type };
    recipes.push(newRecipe);
    saveRecipes();
    document.getElementById('recipe-form').reset();
    showSection('home-section');
  };

  reader.readAsDataURL(imageInput.files[0]);
});

function deleteRecipe(index) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    recipes.splice(index, 1);
    saveRecipes();
    applyFilters();
  }
}

function editRecipe(index) {
  const recipe = recipes[index];
  document.getElementById('recipe-name').value = recipe.name;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('steps').value = recipe.steps;
  document.getElementById('category').value = recipe.category;
  document.getElementById('type').value = recipe.type;
  showSection('add-section');
  deleteRecipe(index);
}

function applyFilters() {
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;

  const filtered = recipes.filter(recipe => {
    return (
      (searchQuery === '' || recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.toLowerCase().includes(searchQuery) ||
        recipe.category.toLowerCase().includes(searchQuery)) &&
      (categoryFilter === '' || recipe.category === categoryFilter) &&
      (typeFilter === '' || recipe.type === typeFilter)
    );
  });

  currentPage = 1;
  renderRecipes(filtered);
}

document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('categoryFilter').addEventListener('change', applyFilters);
document.getElementById('typeFilter').addEventListener('change', applyFilters);


showSection('home-section');




