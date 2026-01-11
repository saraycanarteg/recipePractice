const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 
  'mongodb+srv://mrsproudd:mrsproudd@cluster0.ad7fs0q.mongodb.net/recipepractice?appName=Cluster0'
);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB - recipeManagementSystem database');
});

app.use('/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Recipe Management API',
    endpoints: {
      create: 'POST /recipes',
      getAll: 'GET /recipes',
      update: 'PUT /recipes/:id',
      delete: 'DELETE /recipes/:id'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;