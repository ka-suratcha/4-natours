// == REQ MODEL
// controller is where edit tour happen
const Tour = require('./../models/tourModel');

// == ROUTE HANDLER
exports.getAllTours = (req, res) => {
  // use var from middleware
  console.log(req.requestTime);

  res.status(200).json({
    // JSON formatiing standard
    status: 'success',
    requestAt: req.requestTime,
    results: null, // num of result (tours is JS object)
    data: {
      tour: null,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  res.status(200).json({
    // JSON formatiing standard
    status: 'success',
    requestAt: req.requestTime,
    data: {
      // envelope for data
      tours: null,
    },
  });
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
    console.log(`ERROR!!! : ${err.errmsg}`);

    res.status(400).json({
      status: 'failed',
      message: 'Invaild data sent',
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: '<update tour>',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
