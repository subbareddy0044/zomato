const express = require("express");
const router = express.Router();
const location = require("../Controller/LocationController");
const restaurant = require("../Controller/RestaurantController");
const mealtype = require("../Controller/MealTypeController");
const order = require("../Controller/OrdersController");
const payment = require("../Controller/PaymentController");
// 1st api i.e welcome api
router.get("/api", location.welcome);
// location api
router.get("/api/get-location-list", location.getLocationList);

// restaurant api
router.get(
  "/api/get-restaurant-list-loc-id/:loc_id",
  restaurant.getRestaurantListByLocID
);
router.get(
  "/api/get-restaurant-details-by-id/:id",
  restaurant.getRestaurantDetailsByID
);

router.get("/api/get-menu-items/:rest_id", restaurant.getMenuItems);


router.post("/api/filter", restaurant.filter);

//mealtype
router.get("/api/get-meal-types-list", mealtype.getMealTypeList);

// orders
router.post("/api/save-orders", order.saveNewOrder);

// Payments
router.post("/api/gen-order-id", payment.genOrderId);
router.post("/api/verify-payment", payment.verifyPayment);

// menuitems
module.exports = router;

/* localhost:5003/api */
/* localhost:5003/api/get-location-list */
