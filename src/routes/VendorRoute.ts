import express, { Request, Response, NextFunction } from "express";
import {
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { AddFood, GetFoodByID, GetFoods } from "../controllers";
import { Authenticate } from "../middlewares";
import { images } from "../utility";

const router = express.Router();

router.post("/login", VendorLogin);

router.use(Authenticate);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/coverimage", images, UpdateVendorCoverImage);
router.patch("/service", UpdateVendorService);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);
router.get("/food/:id", GetFoodByID);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "Hello from Vendor" });
});

export { router as VendorRoute };
