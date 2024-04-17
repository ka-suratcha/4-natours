// import app or other related to our app
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

dotenv.config({ patch: './config.env' });

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

// ENVIRONMENT
console.log(`Environment: ${app.get('env')}`);
// console.log(process.env);

// START SERVER
const port = process.env.PORT || 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
