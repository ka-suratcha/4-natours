// import app or other related to our app
const dotenv = require('dotenv');
dotenv.config({ patch: './config.env' });

const app = require('./app.js');

// ENVIRONMENT
console.log(`Environment: ${app.get('env')}`);
// console.log(process.env);

// START SERVER
const port = process.env.PORT || 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
