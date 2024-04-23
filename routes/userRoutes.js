// REQ 3th-PARTY MOUDLE
const express = require('express');

// REQ OWN MOUDLE
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// MIDDLEWARE
const router = express.Router();

// USER
router.post('/signup', authController.signup);
router.post('/login', authController.login); // send in the body

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
