// == REQ MODEL
// controller is where edit tour happen
const Tour = require('./../models/tourModel');

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
    // == BUILD QUERY

    // ==== 1A.) Filltering
    // have to do hard copy cuz JS, when set a var in to another obj, that new var is a reference to that original obj
    const queryObj = { ...req.query }; // shallow copy of req.query, create obj out of that
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // create array of all fields that want to exculde

    // remove fields from query obj by loop over
    excludedFields.forEach((el) => delete queryObj[el]); // delete the field with the name of el

    // ==== 1B.) ADV FILTERRING
    // MongonDB -> { el { '$lt': 'num' } }
    let queryStr = JSON.stringify(queryObj); // JS Obj to JSON String, let cuz edit
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // reaplce $ in front of these -> for MongoDB

    // config query
    let query = Tour.find(JSON.parse(queryStr)); // no way later to implementing other feature -> save Tour.find(query)

    console.log(
      '\n========== Filltering ==========\n- req.query:',
      req.query,
      '\n\n- req.query that exculded:\t\t\t\t',
      queryObj,
      '\n- req.query that exculded and add $ (Filttering):\t',
      queryStr,
      '\n'
    );

    // ==== 2.) Sorting
    if (req.query.sort) {
      // Mongoose -> sort(el1 el2)
      const sortBy = req.query.sort.split(',').join(' '); //split String with comma -> array of all the string

      // config query
      query = query.sort(sortBy);

      // query request from sort
      console.log(
        '\n========== Sorting ==========\n- req.query.sort:\t\t\t',
        req.query.sort,
        '\n- req.query.sort.with.split:\t\t',
        req.query.sort.split(','),
        '\n- req.query.sort.split.join (Sorting):\t',
        req.query.sort.split(',').join(' '),
        '\n'
      );
    } else {
      // default
      // query = query.sort('-__id');
    }

    // ==== 3.) Field limiting
    if (req.query.fields) {
      // Mongoose -> sort(el1 el2)
      const fields = req.query.fields.split(',').join(' ');

      // config query
      query = query.select(fields);

      console.log(
        '\n========== Field limiting ==========\nreq.query.fields:\t\t\t\t',
        req.query.fields,
        '\nreq.query.fields.with.split\t\t\t',
        req.query.fields.split(','),
        '\nreq.query.fields.split.join (Fileding):\t\t',
        req.query.fields.split(',').join(' '),
        '\n'
      );
    } else {
      query = query.select('-__v'); // - is exculding
    }

    // ==== 4.) Pagination
    // convert to number or use default
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    // get page before and * with limit per page to get skip
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // in case skip more doc than actually have
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page dose note exist');
    }

    console.log(
      '\n========== Pagination ==========\npage:\t',
      req.query.page * 1 || 1,
      '\nlimit:\t',
      req.query.limit * 1 || 100,
      '\nskip:\t',
      (page - 1) * limit,
      '\n'
    );

    // == EXECUTE QUERY
    const tours = await query; // find with query that already exculde field

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
