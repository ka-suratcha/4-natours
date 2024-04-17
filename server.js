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
    Type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
  },
  rating: {
    Type: Number,
    default: 4.5,
  },
  price: {
    Type: Number,
    required: [true, 'A Tour must have a price'],
  },
});

// MODEL -> name of model and schema
const Tour = mongoose.model('Tour', tourSchema) // create tour out or schema

// ENVIRONMENT
console.log(`Environment: ${app.get('env')}`);
// console.log(process.env);

// START SERVER
const port = process.env.PORT || 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
