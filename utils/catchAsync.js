// catch Asynchronus error
// in order to get rid our try catch blocks -> wrapped async func indide of the catc Async func
// this func return a new anonymouse function

// create func that take 1 parameter -> fn (function)
// return result of func which is fn(fucntion) that take 3 parameter -> req, res, next
// .catch(next) try to catch Promise from fn
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
