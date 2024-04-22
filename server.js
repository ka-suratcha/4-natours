// import app or other related to our app

// 3TH PARTY MODULES
const mongoose = require('mongoose');

// OWN MODULES
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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
  })
  .then(() => {
    console.log('\nDB connection successfully !!');
  });

// == ENVIRONMENT
console.log(`\nEnvironment: ${app.get('env')}\n`);
// console.log(process.env);

// == START SERVER
const port = process.env.PORT || 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
