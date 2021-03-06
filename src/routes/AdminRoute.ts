import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.post("/create-vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendor/:id", GetVendorByID);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
