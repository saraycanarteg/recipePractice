import React, { useState } from 'react';
import IngredientSearch from './IngredientSearch';

function RecipeForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    servings: 1,
    description: '',
    category: '',
    ingredients: [],
    instructions: [{ description: '', estimatedTimeMinutes: 5 }],
  });
  const [error, setError] = useState('');

  const addIngredient = (ing) => {
    const exists = form.ingredients.find((i) => i.productId === ing.productId);
    if (exists) {
      setError('Ingredient already added');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setForm({
      ...form,
      ingredients: [...form.ingredients, { 
        productId: ing.productId,
        name: ing.name,
        sizeUnit: ing.sizeUnit,
        quantity: 0 
      }],
    });
  };

  const removeIngredient = (productId) => {
    setForm({
      ...form,
      ingredients: form.ingredients.filter((i) => i.productId !== productId),
    });
  };

  const updateQuantity = (productId, qty) => {
    setForm({
      ...form,
      ingredients: form.ingredients.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      ),
    });
  };

  const updateInstruction = (index, field, value) => {
    const newInst = [...form.instructions];
    newInst[index] = { ...newInst[index], [field]: value };
    setForm({ ...form, instructions: newInst });
  };

  const removeInstruction = (index) => {
    if (form.instructions.length > 1) {
      setForm({
        ...form,
        instructions: form.instructions.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!form.name || form.ingredients.length === 0) {
      setError('Name and ingredients are required');
      return;
    }

    if (form.ingredients.some((i) => i.quantity <= 0)) {
      setError('All ingredients need quantity > 0');
      return;
    }

    if (form.instructions.some((i) => !i.description.trim())) {
      setError('All instructions must have description');
      return;
    }

    try {
      await onSubmit({
        name: form.name,
        servings: form.servings,
        description: form.description,
        category: form.category,
        ingredients: form.ingredients.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        instructions: form.instructions.map((i) => ({
          description: i.description,
          estimatedTimeMinutes: i.estimatedTimeMinutes || 5
        })),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card max-width-3xl">
      <h2 className="section-title">Create Recipe</h2>

      {error && <div className="error-message">{error}</div>}

      <div>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Servings</label>
            <input
              type="number"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: +e.target.value })}
              min="1"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="form-textarea"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ingredients</label>
          <IngredientSearch onSelect={addIngredient} />

          <div style={{marginTop: '0.75rem'}}>
            {form.ingredients.map((ing) => (
              <div key={ing.productId} className="ingredient-item">
                <div className="ingredient-info">
                  <div className="ingredient-name">{ing.name}</div>
                  <div className="ingredient-unit">{ing.sizeUnit}</div>
                </div>
                <input
                  type="number"
                  value={ing.quantity}
                  onChange={(e) => updateQuantity(ing.productId, +e.target.value)}
                  className="ingredient-quantity"
                  step="0.1"
                  min="0"
                />
                <button
                  onClick={() => removeIngredient(ing.productId)}
                  className="btn btn-danger"
                  style={{padding: '0.25rem 0.75rem'}}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Instructions</label>
          {form.instructions.map((inst, i) => (
            <div key={i} style={{marginBottom: '1rem'}}>
              <div className="instruction-row">
                <div className="instruction-number">{i + 1}</div>
                <textarea
                  value={inst.description}
                  onChange={(e) => updateInstruction(i, 'description', e.target.value)}
                  className="instruction-textarea"
                  rows="2"
                  placeholder="Instruction description..."
                />
                {form.instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(i)}
                    className="instruction-remove"
                  >
                    ×
                  </button>
                )}
              </div>
              <div style={{marginTop: '0.25rem', marginLeft: '2.5rem'}}>
                <label className="form-label" style={{display: 'inline', marginRight: '0.5rem'}}>
                  Time (minutes):
                </label>
                <input
                  type="number"
                  value={inst.estimatedTimeMinutes}
                  onChange={(e) => updateInstruction(i, 'estimatedTimeMinutes', +e.target.value)}
                  className="form-input"
                  style={{width: '100px', display: 'inline-block'}}
                  min="1"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setForm({ 
              ...form, 
              instructions: [...form.instructions, { description: '', estimatedTimeMinutes: 5 }] 
            })}
            className="btn btn-success"
            style={{marginTop: '0.5rem'}}
          >
            Add Step
          </button>
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleSubmit} className="btn btn-primary">
          Create
        </button>
        <button onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default RecipeForm;