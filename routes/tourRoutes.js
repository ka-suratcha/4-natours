// REQ 3th-PARTY MOUDLE
const express = require('express');

// REQ OWN MOUDLE
const tourController = require('./../controllers/tourController');

// MIDDLEWARE
const router = express.Router(); // create new route and save to var

// PARAM MIDDLEWARE -> only run for certain parameters in URL
// only work for this route (tour)
// router.param('id', tourController.checkID);

// ROUTER

// run middleware manipulate the query obj
router.route('/top-5-cheap').get(tourController.alisaTopTour, tourController.getAllTours)

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
