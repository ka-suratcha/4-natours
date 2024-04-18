// == REQ MODEL
// controller is where edit tour happen
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// == ROUTE HANDLER
exports.alisaTopTour = (req, res, next) => {
  // prefilling parts of query obj before reach handle
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params);

  try {
    const tour = await Tour.findById(req.params.id); // key

    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
    });
  }
};

exports.createTour = async (req, res) => {
  // create new tour based on data that come in from body

  // const newTour = new Tour({})
  // newTour.save // call method on doc

  try {
    // use tour and call method directly then pass data that we want to use with db
    // create doc from req.body according to schema
    const newTour = await Tour.create(req.body); // return promise

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // find data, data that want to update,
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // new update doc wil be returned (want to sent back update doc to client)
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); // key

    res.status(204).json({
      status: 'success',
      requestAt: req.requestTime,
      data: null,
    });
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(`\nERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
