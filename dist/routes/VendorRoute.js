"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var controllers_2 = require("../controllers");
var middlewares_1 = require("../middlewares");
var utility_1 = require("../utility");
var router = express_1.default.Router();
exports.VendorRoute = router;
router.post("/login", controllers_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get("/profile", controllers_1.GetVendorProfile);
router.patch("/profile", controllers_1.UpdateVendorProfile);
router.patch("/coverimage", utility_1.images, controllers_1.UpdateVendorCoverImage);
router.patch("/service", controllers_1.UpdateVendorService);
router.post("/food", utility_1.images, controllers_2.AddFood);
router.get("/foods", controllers_2.GetFoods);
router.get("/food/:id", controllers_2.GetFoodByID);
router.get("/", function (req, res, next) {
    return res.json({ message: "Hello from Vendor" });
});
//# sourceMappingURL=VendorRoute.js.map