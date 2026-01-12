import React from 'react';

function RecipeDetail({ recipe, onDelete, onClose }) {
  return (
    <div className="card max-width-3xl">
      <div className="detail-header">
        <h2 className="detail-title">{recipe.name}</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">Category</div>
          <div className="detail-value">{recipe.category}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Servings</div>
          <div className="detail-value">{recipe.servings}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Total Time</div>
          <div className="detail-value">{recipe.totalPreparationTimeMinutes} min</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Price per Serving</div>
          <div className="detail-value">${recipe.pricePerServing}</div>
        </div>
      </div>

      <div style={{marginBottom: '1.5rem'}}>
        <h3 className="section-title">Description</h3>
        <p style={{color: '#374151'}}>{recipe.description}</p>
      </div>

      <div style={{marginBottom: '1.5rem'}}>
        <h3 className="section-title">Ingredients</h3>
        {recipe.ingredients.map((ing, i) => (
          <div key={i} className="ingredient-item" style={{marginBottom: '0.5rem'}}>
            <span>{ing.ingredientName}</span>
            <span style={{color: '#6b7280'}}>
              {ing.quantity} {ing.unit}
            </span>
          </div>
        ))}
      </div>

      <div style={{marginBottom: '1.5rem'}}>
        <h3 className="section-title">Instructions</h3>
        <div className="instruction-list">
          {recipe.instructions.map((inst, i) => (
            <div key={i} className="instruction-item">
              <div className="instruction-badge">{i + 1}</div>
              <div>
                <p>{inst.description}</p>
                <p className="instruction-time">~{inst.estimatedTimeMinutes} minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onDelete} className="btn btn-danger" style={{width: '100%'}}>
        Delete Recipe
      </button>
    </div>
  );
}

export default RecipeDetail;