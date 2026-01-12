const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

async function getIngredientCollection() {
  const db = mongoose.connection;
  const cols = await db.db.listCollections().toArray();
  const names = cols.map(c => c.name);
  if (names.includes('ingredient')) return db.collection('ingredient');
  if (names.includes('ingredients')) return db.collection('ingredients');
  return db.collection('ingredient');
}

// GET /ingredients - list ingredients (limited)
router.get('/', async (req, res) => {
  try {
    const coll = await getIngredientCollection();
    const items = await coll.find({}).limit(100).toArray();
    return res.status(200).json({ success: true, data: items, count: items.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /ingredients/name/:term - search ingredients by name (case-insensitive contains)
router.get('/name/:term', async (req, res) => {
  try {
    const term = req.params.term || '';
    const coll = await getIngredientCollection();
    const items = await coll.find({ name: { $regex: term, $options: 'i' } }).limit(50).toArray();
    return res.status(200).json({ success: true, data: items, count: items.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /ingredients/:productId - get ingredient by productId
router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const coll = await getIngredientCollection();
    const item = await coll.findOne({ productId });
    if (!item) return res.status(404).json({ success: false, message: 'Ingredient not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
