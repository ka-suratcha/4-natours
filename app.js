// rn file-based API (read data from file) later store data in DB

const fs = require('fs');
// all express config in app.js
const express = require('express');

// add express method to app
const app = express();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//ROUNTING determine how app res to certain client req and URL
// method, URL root (endpoint), status code, resource
// good to specify the API ver (in case changes -> without breaking who still use old ver) [branch off]
// GET method is sent to server on this URL
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({  // JSON formatiing standard
    status: 'success',
    results: tours.length, // num of result (tours is JS object)
    data: { // envelope for data
      tours: tours
    },
  })
});

// START SERVER
const port = 3000
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);

});