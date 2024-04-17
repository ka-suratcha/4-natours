// == REQ MODEL
// controller is where edit tour happen
const Tour = require('./../models/tourModel');

// == ROUTE HANDLER
exports.getAllTours = async (req, res) => {
  try {
    // == BUILD QUERY
    // have to do hard copy cuz JS, when set a var in to another obj, that new var is a reference to that original obj
    const queryObj = { ...req.query }; // shallow copy of req.query, create obj out of that
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // create array of all fields that want to exculde

    // remove these field from query obj by loop over
    excludedFields.forEach((el) => delete queryObj[el]); // delete the field with the name of el

    console.log(req.query, queryObj);

    const query = Tour.find(queryObj); // no way later to implementing other feature -> save Tour.find(query)

    // == EXECUTE QUERY
    const tours = await Tour.find(queryObj); // find with query that already exculde field

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
    console.log(`ERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
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
    console.log(`ERROR!!! : ${err}`);

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
    console.log(`ERROR!!! : ${err}`);

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
    console.log(`ERROR!!! : ${err}`);

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
    console.log(`ERROR!!! : ${err}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
    });
  }
};
