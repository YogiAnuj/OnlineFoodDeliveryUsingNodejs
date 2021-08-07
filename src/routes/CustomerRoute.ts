import express, { Request, Response, NextFunction } from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOTP,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

/* -------------------------sign up/ create customer-------------------- */
router.post("/signup", CustomerSignUp);

/* -------------------------Login---------------------------------------- */
router.post("/login", CustomerLogin);

//authentication
router.use(Authenticate);
/* --------------------------Verify customer account--------------------- */
router.patch("/verify", CustomerVerify);

/* -------------------------OTP requesting / verification--------------- */
router.get("/otp", RequestOTP);

/* -------------------------profile-------------------------------------- */
router.get("/profile", GetCustomerProfile);

router.patch("/profile", EditCustomerProfile);

//cart

//order

//payment

export { router as CustomerRoute };
