const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an ingredient name'],
  },
  description: {
    type: String,
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;