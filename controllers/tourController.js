// == REQ MODEL
// controller is where edit tour happen
const Tour = require('./../models/tourModel');

// == ROUTE HANDLER
exports.getAllTours = async (req, res) => {
  // use var from middleware
  console.log(req.requestTime);

  try {
    const tours = await Tour.find();

    console.log(tours);

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

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
