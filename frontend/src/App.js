import React, { useState, useEffect } from 'react';
import { recipeService } from './services/recipeService';
import RecipeList from './views/RecipeList';
import RecipeForm from './views/RecipeForm';
import RecipeDetail from './views/RecipeDetail';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const res = await recipeService.getAll();
      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleCreate = async (data) => {
    await recipeService.create(data);
    await loadRecipes();
    setView('list');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recipe?')) {
      await recipeService.delete(id);
      await loadRecipes();
      setView('list');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Recipe Manager</h1>
        {view === 'list' && (
          <button onClick={() => setView('create')} className="btn btn-primary">
            Create Recipe
          </button>
        )}
      </div>

      {view === 'list' && (
        <RecipeList
          recipes={recipes}
          onSelect={(r) => {
            setSelected(r);
            setView('detail');
          }}
        />
      )}

      {view === 'create' && (
        <RecipeForm
          onSubmit={handleCreate}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'detail' && selected && (
        <RecipeDetail
          recipe={selected}
          onDelete={() => handleDelete(selected._id)}
          onClose={() => setView('list')}
        />
      )}
    </div>
  );
}

export default App;