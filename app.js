// rn file-based API (read data from file) later store data in DB
// status code 200 completed, 201 created. 204 no content
// GET get data, POST create data, PATCH updata data, DELETE delete data
// express doesnt put body data on req -> use middleware
// POST send data from client to server, req hold all data

// all express config in app.js
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();

// 1.) MIDDLEWARE
// in the middle of req and res (between the step) for modify the incoming req data before res
// add express method to app
// route is kind of middleware themselves
app.use(morgan('dev'));
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

// ROUTE
// mounting ther router (cant use route before declare)
app.use('/api/v1/tours', tourRouter); // this is middleware, use for specific route
app.use('/api/v1/users', userRouter);

// 4.) START SERVER
const port = 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);

});