const express = require('express');
const Recipe = require('../models/recipeModel');
const { validateCreateRecipe, validateUpdateRecipe } = require('../controller/recipeValidation');
const {
  calculateCosts,
  enrichIngredientsWithData,
  enrichInstructionsWithTime,
  calculateTotalTime,
  checkRecipeExists,
  findActiveRecipe
} = require('../controller/recipeFunctions');

const router = express.Router();

// POST /recipes - Create recipe
router.post('/', async (req, res) => {
  try {
    validateCreateRecipe(req.body);

    // Business Rule: Check unique name
    await checkRecipeExists(req.body.name);

    // Business Rule: Enrich ingredients with name and unit from database
    const enrichedIngredients = await enrichIngredientsWithData(req.body.ingredients);

    // Business Rule: Enrich instructions with time
    const enrichedInstructions = enrichInstructionsWithTime(req.body.instructions);
    
    // Business Rule: Calculate total preparation time
    const totalTime = calculateTotalTime(enrichedInstructions);

    // Business Rule: Calculate costs
    const costs = await calculateCosts(req.body.ingredients, req.body.servings);

    const recipe = new Recipe({
      name: req.body.name,
      servings: req.body.servings,
      description: req.body.description,
      category: req.body.category,
      ingredients: enrichedIngredients,
      instructions: enrichedInstructions,
      totalPreparationTimeMinutes: totalTime,
      costPerServing: costs.costPerServing,
      pricePerServing: costs.pricePerServing,
      isActive: true
    });

    const newRecipe = await recipe.save();

    return res.status(201).json({
      success: true,
      data: newRecipe,
      message: 'Recipe created successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /recipes - Get all active recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isActive: true });
    
    return res.status(200).json({
      success: true,
      data: recipes,
      count: recipes.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /recipes/:id - Update recipe
router.put('/:id', async (req, res) => {
  try {
    validateUpdateRecipe(req.body);

    const recipe = await findActiveRecipe(req.params.id);

    // Business Rule: Recalculate costs if ingredients or servings change
    if (req.body.ingredients || req.body.servings) {
      const ingredients = req.body.ingredients || recipe.ingredients;
      const servings = req.body.servings || recipe.servings;
      
      if (req.body.ingredients) {
        const enrichedIngredients = await enrichIngredientsWithData(req.body.ingredients);
        req.body.ingredients = enrichedIngredients;
      }
      
      const costs = await calculateCosts(ingredients, servings);
      req.body.costPerServing = costs.costPerServing;
      req.body.pricePerServing = costs.pricePerServing;
    }

    // Business Rule: Recalculate time if instructions change
    if (req.body.instructions) {
      const enrichedInstructions = enrichInstructionsWithTime(req.body.instructions);
      req.body.instructions = enrichedInstructions;
      req.body.totalPreparationTimeMinutes = calculateTotalTime(enrichedInstructions);
    }

    Object.assign(recipe, req.body);
    const updatedRecipe = await recipe.save();

    return res.status(200).json({
      success: true,
      data: updatedRecipe,
      message: 'Recipe updated successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /recipes/:id - Logical delete recipe
router.delete('/:id', async (req, res) => {
  try {
    // Business Rule: Logical deletion only
    const recipe = await findActiveRecipe(req.params.id);

    recipe.isActive = false;
    recipe.deletedAt = new Date();
    
    const deletedRecipe = await recipe.save();

    return res.status(200).json({
      success: true,
      data: deletedRecipe,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;