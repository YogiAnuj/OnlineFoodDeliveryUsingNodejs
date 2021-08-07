import express from "express";
import {
  GetFoodAvailablity,
  GetFoodsIn30Mins,
  GetTopRestaurants,
  RestaurantsByID,
  SearchFoods,
} from "../controllers";

const router = express();

/* -------------------Food Availability----------------- */
router.get("/:pincode", GetFoodAvailablity);

/* -------------------Top Restaurants----------------- */
router.get("/top-restaurants/:pincode", GetTopRestaurants);

/* -------------------Food Available in 30 minutes----------------- */
router.get("/30-min-food/:pincode", GetFoodsIn30Mins);

/* -------------------Search Food----------------- */
router.get("/search/:pincode", SearchFoods);

/* -------------------Find restaurant by id----------------- */
router.get("/restaurant/:id", RestaurantsByID);

export { router as ShoppingRoute };
