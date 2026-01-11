const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    servings: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    ingredients: [
      {
        ingredientName: { type: String, required: true },
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        unit: { type: String, required: true }
      }
    ],
    instructions: [
      {
        description: { type: String, required: true },
        estimatedTimeMinutes: { type: Number, required: true, min: 0 }
      }
    ],
    totalPreparationTimeMinutes: { type: Number, required: true, default: 0 },
    costPerServing: { type: Number, required: true, min: 0 },
    pricePerServing: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  {
    collection: 'recipe',
    timestamps: true
  }
);

recipeSchema.index({ name: 1, isActive: 1 });
recipeSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);