import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Card, CardContent, CardActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as api from '../api/recipeService';
import { normalizeRecipe } from '../model/recipeModel';

export default function RecipeListView({ onEdit }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.getAllRecipes();
      const items = (res && res.data) || [];
      setRecipes(items.map(normalizeRecipe));
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      await api.deleteRecipe(id);
      setRecipes(r => r.filter(x => x.id !== id));
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress/></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!recipes || recipes.length === 0) return <Typography>No recipes yet</Typography>;

  return (
    <Grid container spacing={2}>
      {recipes.map(r => (
        <Grid item xs={12} sm={6} md={4} key={r.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{r.name}</Typography>
              <Typography variant="body2" color="text.secondary">{r.description}</Typography>
              <Box mt={2} display="flex" gap={2}>
                <Typography variant="caption">Servings: {r.servings}</Typography>
                <Typography variant="caption">Time: {r.totalPreparationTimeMinutes} min</Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button startIcon={<EditIcon/>} onClick={() => onEdit(r)} variant="contained">Edit</Button>
              <Button startIcon={<DeleteIcon/>} onClick={() => handleDelete(r.id)} color="error">Delete</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
