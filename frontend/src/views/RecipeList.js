import React from 'react';

function RecipeList({ recipes, onSelect }) {
  return (
    <div className="card">
      <h2 className="section-title">Recipes</h2>
      
      {recipes.length === 0 ? (
        <p style={{color: '#6b7280'}}>No recipes found</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => onSelect(recipe)}
              className="recipe-card"
            >
              <h3 className="recipe-title">{recipe.name}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-info">
                <span style={{color: '#6b7280'}}>{recipe.servings} servings</span>
                <span style={{color: '#3b82f6', fontWeight: '500'}}>
                  ${recipe.pricePerServing}
                </span>
              </div>
              <span className="recipe-category">{recipe.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;