// rn file-based API (read data from file) later store data in DB
// status code 200 completed, 201 created. 204 no content
// GET get data, POST create data, PATCH updata data, DELETE delete data
// express doesnt put body data on req -> use middleware
// POST send data from client to server, req hold all data

const fs = require('fs');
// all express config in app.js
const express = require('express');
const { request } = require('http');

// MIDDLEWARE
// in the middle of req and res (between the step) for modify the incoming req data before res
// add express method to app
// route is kind of middleware themselves
const app = express();
app.use(express.json()); // data from body is added req obj

// create middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// EXPORT route handler
const getAllTours = (req, res) => {
  // use var from middleware
  console.log(req.requestTime);

  res.status(200).json({  // JSON formatiing standard
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length, // num of result (tours is JS object)
    data: { // envelope for data
      tours: tours
    }
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  // find el where id = one that get from params (URL)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      requestAt: req.requestTime,
      message: 'invaild ID'
    });
  }

  res.status(200).json({  // JSON formatiing standard
    status: 'success',
    requestAt: req.requestTime,
    data: { // envelope for data
      tours: tour
    }
  });
};

const createTour = (req, res) => {
  console.log(req.body);

  // find id to create new data (usually db takes care of this)
  const newId = tours[tours.length - 1].id + 1; // length get num, -1 for get lastest index
  const newTour = Object.assign({ id: newId }, req.body); // merging 2 objects
  tours.push(newTour); // push new tour to tours obj

  // use async ver cuz rn we in callback func
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => { // overwrite
    res.status(201).json({
      status: "success",
      requestAt: req.requestTime,
      data: {
        tour: newTour
      }
    });
  });
};

const updateTour = (req, res) => {
  // find el where id = one that get from params (URL)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invaild ID'
    });
  }

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: '<update tour>'
  });
};

const deleteTour = (req, res) => {

  // find el where id = one that get from params (URL)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invaild ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};

//ROUNTING determine how app res to certain client req and URL
// method, URL root (endpoint), status code, resource
// good to specify the API ver (in case changes -> without breaking who still use old ver) [branch off]

// GET method -> get data
app.get('/api/v1/tours', getAllTours);

// api with passing variable
app.get('/api/v1/tours/:id', getTour);

// POST method -> create new data
// send data from client to server, data available on req -> req hold all data

app.post('/api/v1/tours', createTour);

// PATCH method update data (only expect properties)
app.patch('/api/v1/tours/:id', updateTour);

// DETELE method delete data
app.delete('/api/v1/tours/:id', deleteTour);

// in case change ver or resource name
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(createTour)
  .delete(deleteTour);

// START SERVER``
const port = 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);

});