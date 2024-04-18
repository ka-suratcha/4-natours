const mongoose = require('mongoose');

// SCHEMA: describe data and validator
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ' A tour must have a name'],
    unique: true,
    trim: true,
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'A tour must have group size'],
  },
  difficulty: {
    type: String,
    rquired: [true, ' A tiur must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, ' A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    require: [true, 'A tour must have a cover image'],
  }, //multiple image
  images: [String], //array of string
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

// MODEL -> name of model and schema
const Tour = mongoose.model('Tour', tourSchema); // create tour out or schema

module.exports = Tour;
