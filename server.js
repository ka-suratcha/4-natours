// import app or other related to our app
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

dotenv.config({ patch: './config.env' });

// CONNECT TO DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfully');
  });

// SCHEMA: describe data and validator
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// MODEL -> name of model and schema
const Tour = mongoose.model('Tour', tourSchema); // create tour out or schema

// DOCUMENT
const testTour = new Tour({
  name: 'The testtt',
});
testTour
  .save() // reture promise
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR !!!!!: ', err);
  });

// ENVIRONMENT
console.log(`Environment: ${app.get('env')}`);
// console.log(process.env);

// START SERVER
const port = process.env.PORT || 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
