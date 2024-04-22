// import app or other related to our app

// 3TH PARTY MODULES
const mongoose = require('mongoose');

// OWN MODULES
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err.name, err.message);
  }
  process.exit(1);
});

const app = require('./app.js');

// == CONNECT TO DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// == ENVIRONMENT
console.log(`\nEnvironment: ${app.get('env')}\n`);
// console.log(process.env);

// == START SERVER
const port = process.env.PORT || 3000;
// listening to req
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// == listening to 'unhandler rejection' event allows us to handle all the errors that occur in asynchoronuse
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err.name, err.message);
  }
  server.close(() => {
    process.exit(1);
  });
});
