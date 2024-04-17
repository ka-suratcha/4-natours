const mongoose = require('mongoose');

// SCHEMA: describe data and validator
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// MODEL -> name of model and schema
const Tour = mongoose.model('Tour', tourSchema); // create tour out or schema

module.exports = Tour;