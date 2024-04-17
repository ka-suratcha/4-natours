// REQ BUILT-IN MOUDLE
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// MIDDLEWARE
exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invaild ID',
    });
  }
  next();
};

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

// ROUTE HANDLER
exports.getAllTours = (req, res) => {
  // use var from middleware
  console.log(req.requestTime);

  res.status(200).json({
    // JSON formatiing standard
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length, // num of result (tours is JS object)
    data: {
      // envelope for data
      tours: tours,
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
      tours: tours[req.params.id],
    },
  });
};

exports.createTour = (req, res) => {
  // find id to create new data (usually db takes care of this)
  const newId = tours[tours.length - 1].id + 1; // length get num, -1 for get lastest index
  const newTour = Object.assign({ id: newId }, req.body); // merging 2 objects
  tours.push(newTour); // push new tour to tours obj

  // use async ver cuz rn we in callback func
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // overwrite
      res.status(201).json({
        status: 'success',
        requestAt: req.requestTime,
        data: {
          tour: newTour,
        },
      });
    }
  );
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
