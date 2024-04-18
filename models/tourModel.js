const mongoose = require('mongoose');

// SCHEMA: describe data and validator
//mongoose.Schema can pass obj with th schema definition itself and obj for schema options
const tourSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true }, // each time the data is outputed as JSON want to be true (viruals to be part of the output)
    toObject: { virtuals: true }, // when data get outputted as obj
  }
);

// VIRTUAL
// cant use in query cuz technically not part of db
// can done this each time after we query ex. controller but not best practice cuz keep business logic and application logiv asmuch sepatated as possible

// arrow func doesnt get its own disk keyword -> pointing to current doc and when use 'this.' should use regular func
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// MODEL -> name of model and schema
const Tour = mongoose.model('Tour', tourSchema); // create tour out or schema

module.exports = Tour;
