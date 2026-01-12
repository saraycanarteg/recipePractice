const BASE = 'https://recipepractice.onrender.com';

async function handle(res) {
  let json = {};
  try {
    json = await res.json();
  } catch (_) {
    // ignore parse errors
  }
  if (!res.ok) {
    const msg = (json && json.message) || res.statusText || 'API error';
    throw new Error(msg);
  }
  return json;
}

export async function getAllRecipes() {
  const res = await fetch(`${BASE}/recipes`);
  return handle(res);
}

export async function createRecipe(data) {
  const res = await fetch(`${BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE}/recipes/${id}`, { method: 'DELETE' });
  return handle(res);
}

// Ingredient search - backend may need a route; this tries a common pattern
export async function searchIngredients(q) {
  if (!q || q.trim().length === 0) return { success: true, data: [] };
  // call RESTful name search
  const url = `${BASE}/ingredients/name/${encodeURIComponent(q)}`;
  const res = await fetch(url);
  return handle(res);
}
