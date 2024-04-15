// all express config in app.js
const express = require('express');

// add express method to app
const app = express();

//ROUNTING determine how app res to certain client req and URL
// method, URL root, res
// GET method is sent to server on this URL
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' }); // auto set content type to json

});

// POST method is 
app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
})

// START SERVER
const port = 3000
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);

})