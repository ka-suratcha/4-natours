// == REQ MODEL
// controller is where edit tour happen
const Tour = require('./../models/tourModel');

// == MIDDLEWARE
exports.checkReqBody = (req, res, next) => {
  console.log(req.body);

  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'failed',
      message: 'Missing name or price',
    });
  }
  next();
};

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

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tour: null,
    },
  });
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
