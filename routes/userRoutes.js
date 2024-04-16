// REQ 3th-PARTY MOUDLE
const express = require('express');

// REQ OWN MOUDLE
const userController = require('./../controllers/userController');

// MIDDLEWARE
const router = express.Router();

// USER
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