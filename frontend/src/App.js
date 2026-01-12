import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import RecipeListView from './view/recipeListView';
import RecipeFormView from './view/recipeFormView';

export default function App() {
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(null);

  const openCreate = () => { setEditing(null); setTab(1); };
  const handleEdit = (recipe) => { setEditing(recipe); setTab(1); };
  const handleSaved = () => { setTab(0); setEditing(null); };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>Recipe Practice</Typography>
        <Typography variant="body1" align="center">Manage recipes — pastel theme</Typography>
      </Paper>

      <Paper sx={{ p:2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="List" />
          <Tab label={editing ? 'Edit' : 'Create'} />
        </Tabs>

        <Box sx={{ mt:2 }}>
          {tab === 0 && <RecipeListView onEdit={handleEdit} />}
          {tab === 1 && <RecipeFormView recipe={editing} onSaved={handleSaved} onCancel={() => setTab(0)} />}
        </Box>
      </Paper>
    </Container>
  );
}
