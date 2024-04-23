// REQ 3th-PARTY MOUDLE
const express = require('express');

// REQ OWN MOUDLE
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

// MIDDLEWARE
const router = express.Router(); // create new route and save to var

// PARAM MIDDLEWARE -> only run for certain parameters in URL
// only work for this route (tour)
// router.param('id', tourController.checkID);

// ROUTER

// run middleware manipulate the query obj
router
  .route('/top-5-cheap')
  .get(tourController.alisaTopTour, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/') // tourRouteer only run on /api/v1/tours
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
