const mongoose = require('mongoose');
const slugify = require('slugify');

// SCHEMA: describe data and validator
//mongoose.Schema can pass obj with th schema definition itself and obj for schema options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      mix: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, ' A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW doc creation
          return val < this.price; // this keyword only point to current doc when creating new doc => so not work on "update"
        },
        message: 'Discount price ({VALUE}) should be below regular price', // msg have access to var of field in current doc (internal to mongoose)
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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

// DOCUMENT MIDDLEWARE: runs before/after .save() and .create()

// pre -> run before an actual event (save event)
// point to currently processed doc (access to doc that is being processed)
tourSchema.pre('save', function (next) {
  // doc that is being saved
  console.log(this);

  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('will save doc.......');
//   next();
// });

// // post -> run after an acutual event
// tourSchema.post('save', function (doc, next) {
//   // doc that was just save to db
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // all string that start with 'find'
  // point to current query
  this.find({ secretTour: { $ne: true } }); // find secretTouris true and hide it
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // access to all docs
  console.log(`Query took ${Date.now() - this.start} ms!`);

  console.log(docs);
  next();
});

// AGGREATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// MODEL -> name of model and schema
const Tour = mongoose.model('Tour', tourSchema); // create tour out or schema

module.exports = Tour;
