// rn file-based API (read data from file) later store data in DB
// status code 200 completed, 201 created

const fs = require('fs');
// all express config in app.js
const express = require('express');

// add express method to app
const app = express();

// MIDDLEWARE
// in the middle of req and res (the step go through)
// modify the incoming req data before res
app.use(express.json()); // data from body is added req obj

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//ROUNTING determine how app res to certain client req and URL
// method, URL root (endpoint), status code, resource
// good to specify the API ver (in case changes -> without breaking who still use old ver) [branch off]

// GET method -> get data
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({  // JSON formatiing standard
    status: 'success',
    results: tours.length, // num of result (tours is JS object)
    data: { // envelope for data
      tours: tours
    }
  })
});

// api with passing variable
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // find el where id = one that get from params (URL)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id)

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invaild ID'
    })
  }

  res.status(200).json({  // JSON formatiing standard
    status: 'success',
    data: { // envelope for data
      tours: tour
    }
  })
});

// POST method -> create new data
// send data from client to server, data available on req -> req hold all data
// express doesnt put body data on req -> use middleware
app.post('/api/v1/tours/', (req, res) => {
  console.log(req.body);

  // find id to create new data (usually db takes care of this)
  const newId = tours[tours.length - 1].id + 1 // length get num, -1 for get lastest index
  const newTour = Object.assign({ id: newId }, req.body); // merging 2 objects
  tours.push(newTour); // push new tour to tours obj

  // use async ver cuz rn we in callback func
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => { // overwrite
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    })
  })
})

// PATCH method update data (only expect properties)
app.patch('/api/v1/tours/:id', (req, res) => {

  // find el where id = one that get from params (URL)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id)

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invaild ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: '<update tour>'
  })
})

// START SERVER
const port = 3000
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);

});