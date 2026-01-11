// SRP: Only responsible for validation logic

const validateCreateRecipe = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.servings || data.servings < 1 || data.servings > 300) {
    errors.push('Servings must be between 1 and 300');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!data.ingredients || data.ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  } else {
    data.ingredients.forEach((ing, index) => {
      if (!ing.productId || !ing.quantity) {
        errors.push(`Ingredient at position ${index + 1} is missing required fields (productId, quantity)`);
      }
      if (ing.quantity <= 0) {
        errors.push(`Ingredient at position ${index + 1} must have quantity greater than 0`);
      }
    });
  }

  if (!data.instructions || data.instructions.length === 0) {
    errors.push('At least one instruction is required');
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};

const validateUpdateRecipe = (data) => {
  const errors = [];

  if (data.servings && (data.servings < 1 || data.servings > 300)) {
    errors.push('Servings must be between 1 and 300');
  }

  if (data.ingredients && data.ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  } else if (data.ingredients) {
    data.ingredients.forEach((ing, index) => {
      if (!ing.productId || !ing.quantity) {
        errors.push(`Ingredient at position ${index + 1} is missing required fields (productId, quantity)`);
      }
      if (ing.quantity <= 0) {
        errors.push(`Ingredient at position ${index + 1} must have quantity greater than 0`);
      }
    });
  }

  if (data.instructions && data.instructions.length === 0) {
    errors.push('At least one instruction is required');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};

module.exports = {
  validateCreateRecipe,
  validateUpdateRecipe
};