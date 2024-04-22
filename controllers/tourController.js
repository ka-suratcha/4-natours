// == REQ MODEL
// controller is where edit tour happen

// import model
const Tour = require('./../models/tourModel');

const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

// == ROUTE HANDLER
exports.alisaTopTour = (req, res) => {
  // prefilling parts of query obj before reach handle
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // == EXECUTE QUERY
  // create instance -> will access to all the methods that definded in class
  // manipulate the query
  const feature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFieds()
    .paginate();
  const tours = await feature.query; // find with query that already exculde field

  // == SEND RESPONE
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length, // num of result (tours is JS object)
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  console.log('\n', req.params);
  const tour = await Tour.findById(req.params.id); // key

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body); // return promise

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // find data, data that want to update,
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // new update doc wil be returned (want to sent back update doc to client)
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id); // key

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    requestAt: req.requestTime,
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // select el that ratingsAverage is >= 4.5
    },
    {
      $group: {
        // grouped and show...
        _id: { $toUpper: '$difficulty' }, // everything in 1 group -> can calculate the statistics for all tours tgt
        numTours: { $sum: 1 }, // num of tour -> sum add 1 for each doc (each of doc thats go through pipeline will be added to cum counter)
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // sort by....
    },
  ]);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //deconstruct array field from doc then output 1 doc for each el of array
    },
    {
      $match: {
        // match is for select doc
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // group by month
        numTourStarts: { $sum: 1 }, // counter
        tours: { $push: '$name' }, // get array of tour that start in this month
      },
    },
    {
      $addFields: { month: '$_id' }, // and field month that show $_id var
    },
    {
      $project: {
        // not show _id
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 }, // sort by most tour start in that month
    },
    {
      $limit: 12, // limit outputs
    },
  ]);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: plan.length,
    data: { plan },
  });
});
