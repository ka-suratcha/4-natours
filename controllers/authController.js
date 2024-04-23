// import model
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  }); // only allow the data that actually need to be put into the new user

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // create token (header will created automatically)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
