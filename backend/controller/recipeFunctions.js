// SRP: Business logic functions
// DIP: Depends on mongoose connection to access ingredient collection
const Recipe = require('../models/recipeModel');
const mongoose = require('mongoose');

const PROFIT_MARGIN = 2;
const AVERAGE_TIME_PER_INSTRUCTION = 5;

// OCP: Can be extended with different calculation strategies
const calculateCosts = async (ingredients, servings) => {
  let totalCost = 0;

  const db = mongoose.connection;
  const ingredientCollection = db.collection('ingredient');

  for (const ingredient of ingredients) {
    const ingredientData = await ingredientCollection.findOne({ 
      productId: ingredient.productId,
      isActive: true 
    });

    if (!ingredientData) {
      throw new Error(`Ingredient not found: ${ingredient.productId}`);
    }

    // Business Rule: Calculate cost based on quantity and price per unit size
    const ingredientCost = (ingredient.quantity / ingredientData.size) * ingredientData.price;
    totalCost += ingredientCost;
  }

  if (servings <= 0) {
    throw new Error('Servings must be greater than zero');
  }

  const costPerServing = totalCost / servings;
  // Business Rule: Apply profit margin
  const pricePerServing = costPerServing * PROFIT_MARGIN;

  return {
    costPerServing: parseFloat(costPerServing.toFixed(2)),
    pricePerServing: parseFloat(pricePerServing.toFixed(2))
  };
};

const enrichIngredientsWithData = async (ingredients) => {
  const db = mongoose.connection;
  const ingredientCollection = db.collection('ingredient');

  const enrichedIngredients = [];

  for (const ingredient of ingredients) {
    const ingredientData = await ingredientCollection.findOne({ 
      productId: ingredient.productId,
      isActive: true 
    });

    if (!ingredientData) {
      throw new Error(`Ingredient not found: ${ingredient.productId}`);
    }

    enrichedIngredients.push({
      ingredientName: ingredientData.name,
      productId: ingredient.productId,
      quantity: ingredient.quantity,
      unit: ingredientData.sizeUnit
    });
  }

  return enrichedIngredients;
};

const enrichInstructionsWithTime = (instructions) => {
  return instructions.map(instruction => {
    if (typeof instruction === 'string') {
      return {
        description: instruction,
        estimatedTimeMinutes: AVERAGE_TIME_PER_INSTRUCTION
      };
    }
    
    return {
      description: instruction.description,
      estimatedTimeMinutes: instruction.estimatedTimeMinutes || AVERAGE_TIME_PER_INSTRUCTION
    };
  });
};

const calculateTotalTime = (instructions) => {
  if (!instructions || instructions.length === 0) {
    return 0;
  }

  return instructions.reduce((total, instruction) => {
    return total + (instruction.estimatedTimeMinutes || AVERAGE_TIME_PER_INSTRUCTION);
  }, 0);
};

const checkRecipeExists = async (name) => {
  const existingRecipe = await Recipe.findOne({ 
    name, 
    isActive: true 
  });
  
  if (existingRecipe) {
    throw new Error('Recipe with this name already exists');
  }
};

const findActiveRecipe = async (id) => {
  const recipe = await Recipe.findOne({ _id: id, isActive: true });
  
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  
  return recipe;
};

module.exports = {
  calculateCosts,
  enrichIngredientsWithData,
  enrichInstructionsWithTime,
  calculateTotalTime,
  checkRecipeExists,
  findActiveRecipe
};