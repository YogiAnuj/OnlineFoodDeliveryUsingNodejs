"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var router = express_1.default();
exports.ShoppingRoute = router;
/* -------------------Food Availability----------------- */
router.get("/:pincode", controllers_1.GetFoodAvailablity);
/* -------------------Top Restaurants----------------- */
router.get("/top-restaurants/:pincode", controllers_1.GetTopRestaurants);
/* -------------------Food Available in 30 minutes----------------- */
router.get("/30-min-food/:pincode", controllers_1.GetFoodsIn30Mins);
/* -------------------Search Food----------------- */
router.get("/search/:pincode", controllers_1.SearchFoods);
/* -------------------Find restaurant by id----------------- */
router.get("/restaurant/:id", controllers_1.RestaurantsByID);
//# sourceMappingURL=ShoppingRoute.js.map