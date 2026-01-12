export function normalizeRecipe(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name || '',
    servings: raw.servings || 1,
    description: raw.description || '',
    category: raw.category || '',
    ingredients: raw.ingredients || [],
    instructions: raw.instructions ? raw.instructions.map(inst => (typeof inst === 'string' ? inst : inst.description)) : [],
    totalPreparationTimeMinutes: raw.totalPreparationTimeMinutes || 0,
    costPerServing: raw.costPerServing || 0,
    pricePerServing: raw.pricePerServing || 0,
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
