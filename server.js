// import app or other related to our app
const app = require('./app.js');

// START SERVER
const port = 3000;
// listening to req
app.listen(port, () => {
  console.log(`app running on port ${port}...`);

});