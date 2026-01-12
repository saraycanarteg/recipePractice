import React, { useState, useEffect } from 'react';
import { Box, TextField, Grid, Button, Paper, IconButton, Typography, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Autocomplete from '@mui/material/Autocomplete';
import * as api from '../api/recipeService';

export default function RecipeFormView({ recipe: initialRecipe, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: '', servings: 1, description: '', category: '', ingredients: [{ name: '', productId: '', unit: '', quantity: '' }], instructions: ['']
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({}); // map index -> options

  useEffect(() => {
    if (initialRecipe) {
      setForm({
        name: initialRecipe.name,
        servings: initialRecipe.servings,
        description: initialRecipe.description,
        category: initialRecipe.category,
        ingredients: initialRecipe.ingredients.map(i => ({ name: i.ingredientName || '', productId: i.productId || '', unit: i.unit || '', quantity: i.quantity || '' })),
        instructions: initialRecipe.instructions || ['']
      });
    }
  }, [initialRecipe]);

  const handleIngredientSearch = async (index, q) => {
    try {
      const res = await api.searchIngredients(q);
      const items = (res && res.data) || [];
      setSearchResults(prev => ({ ...prev, [index]: items }));
    } catch (err) {
      setSearchResults(prev => ({ ...prev, [index]: [] }));
    }
  };

  const handleIngredientSelect = (index, selected) => {
    if (!selected) return;
    const updated = [...form.ingredients];
    updated[index] = { ...updated[index], name: selected.name || selected.ingredientName || '', productId: selected.productId || selected.id || '', unit: selected.sizeUnit || selected.unit || '' };
    setForm({ ...form, ingredients: updated });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...form.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, ingredients: updated });
  };

  const addIngredient = () => setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', productId: '', unit: '', quantity: '' }] }));
  const removeIngredient = (i) => setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // simple validation
    if (!form.name.trim()) return setErrors({ name: 'Name required' });
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        servings: form.servings,
        description: form.description,
        category: form.category,
        ingredients: form.ingredients.map(i => ({ productId: i.productId, quantity: Number(i.quantity) })),
        instructions: form.instructions
      };
      if (initialRecipe && initialRecipe.id) {
        await api.updateRecipe(initialRecipe.id, payload);
      } else {
        await api.createRecipe(payload);
      }
      onSaved();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: 'auto' }}>
      {errors.submit && <Alert severity="error">{errors.submit}</Alert>}

      <Typography variant="h6">Basic Information</Typography>
      <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ my: 2 }} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Servings" value={form.servings} onChange={(e) => setForm({ ...form, servings: Number(e.target.value) || 1 })} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Grid>
      </Grid>
      <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mb: 2 }} />

      <Typography variant="h6">Ingredients</Typography>
      {form.ingredients.map((ing, idx) => (
        <Paper key={idx} sx={{ p:2, mb:2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Autocomplete
                freeSolo
                options={(searchResults[idx] || []).map(opt => ({ label: opt.name || opt.ingredientName || opt.productId, data: opt }))}
                onInputChange={(e, v) => handleIngredientSearch(idx, v)}
                onChange={(e, v) => handleIngredientSelect(idx, (v && v.data) || null)}
                renderInput={(params) => <TextField {...params} label="Ingredient name" value={ing.name} onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)} />}
              />
            </Grid>
            <Grid item xs={6} sm={4}><TextField fullWidth label="Quantity" type="number" value={ing.quantity} onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)} /></Grid>
            <Grid item xs={6} sm={2}><TextField fullWidth label="Unit" value={ing.unit} onChange={(e)=> handleIngredientChange(idx, 'unit', e.target.value)} /></Grid>
            <Grid item xs={12} sm={1}>{form.ingredients.length>1 && <IconButton onClick={()=> removeIngredient(idx)}><RemoveIcon /></IconButton>}</Grid>
          </Grid>
        </Paper>
      ))}

      <Button startIcon={<AddIcon/>} onClick={addIngredient} sx={{ mb: 2 }}>Add Ingredient</Button>

      <Typography variant="h6">Instructions</Typography>
      {form.instructions.map((inst, i) => (
        <Grid container spacing={2} key={i} sx={{ mb: 1 }}>
          <Grid item xs={11}><TextField fullWidth multiline rows={2} label={`Step ${i+1}`} value={inst} onChange={(e)=> setForm(prev=> ({ ...prev, instructions: prev.instructions.map((s,idx)=> idx===i? e.target.value : s) }))} /></Grid>
          <Grid item xs={1}>{form.instructions.length>1 && <IconButton onClick={()=> setForm(prev=> ({ ...prev, instructions: prev.instructions.filter((_,idx)=> idx!==i) }))}><RemoveIcon/></IconButton>}</Grid>
        </Grid>
      ))}
      <Button startIcon={<AddIcon/>} onClick={()=> setForm(prev=> ({ ...prev, instructions: [...prev.instructions, ''] }))} sx={{ mb:2 }}>Add Step</Button>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><Button fullWidth type="submit" variant="contained" disabled={loading}>{initialRecipe ? 'Update' : 'Create'}</Button></Grid>
        <Grid item xs={12} sm={6}><Button fullWidth variant="outlined" onClick={onCancel}>Cancel</Button></Grid>
      </Grid>
    </Box>
  );
}
