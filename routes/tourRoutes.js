// REQ 3th-PARTY MOUDLE
const express = require('express');

// REQ OWN MOUDLE
const tourController = require('./../controllers/tourController');

// MIDDLEWARE
const router = express.Router(); // create new route and save to var

// ROUTER
router
  .route('/') // tourRouteer only run on /api/v1/tours
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;