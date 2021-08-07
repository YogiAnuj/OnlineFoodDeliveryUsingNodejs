import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateCustomerInput,
  CustomerLoginInputs,
  EditCustomerProfileInput,
} from "../dto";
import {
  comparePassword,
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  onRequestOTP,
} from "../utility";
import { Customer } from "../models/Customer";
import { GenerateSignature } from "../utility/SignatureUtility";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(CreateCustomerInput, req.body);
  const inputErrors = await validate(customerInput, {
    validationError: { target: false },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { password, phone, email } = customerInput;

  const checkCustomer = await Customer.findOne({ phone });
  if (checkCustomer !== null) {
    return res.status(401).json({ message: "Customer already exists." });
  }

  const salt = await GenerateSalt();

  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = await GenerateOTP();

  const result = await Customer.create({
    email,
    phone,
    password: userPassword,
    salt,
    otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    lat: 0,
    lng: 0,
    verified: false,
  });

  if (result) {
    // send OTP to the customer
    await onRequestOTP(otp, phone);

    // generate the signature
    const signature = await GenerateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to the client
    return res.json({
      signature,
      email: result.email,
      verified: result.verified,
    });
  }

  return res.status(500).json({ message: "Something went wrong." });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (
      profile &&
      profile.otp === parseInt(otp) &&
      profile.otp_expiry >= new Date()
    ) {
      profile.verified = true;
      const updatedProfile = await profile.save();

      // generate updated signature
      const signature = await GenerateSignature({
        _id: updatedProfile.id,
        email: updatedProfile.email,
        verified: updatedProfile.verified,
      });

      return res.json({
        signature,
        email: updatedProfile.email,
        verified: updatedProfile.verified,
      });
    }
    return res.status(401).json({ message: "OTP expired." });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong while otp validation." });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(CustomerLoginInputs, req.body);
  const inputErrors = await validate(loginInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { phone, password } = loginInputs;

  const customer = await Customer.findOne({ phone });
  if (customer !== null) {
    const validation = await comparePassword(password, customer.password);

    if (validation) {
      // generate the signature
      const signature = await GenerateSignature({
        _id: customer.id,
        email: customer.email,
        verified: customer.verified,
      });

      // send the customer to the client
      return res.json({
        signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
    return res.status(401).json({ message: "Incorrect password." });
  }
  return res.status(401).json({ message: "Invalid phone number." });
};

export const RequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer?._id);
    if (profile) {
      const { otp, expiry } = await GenerateOTP();
      await onRequestOTP(otp, profile?.phone);

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      return res.json({ message: "OTP sent to the registered phone number." });
    }
  }
  return res
    .status(500)
    .json({ message: "Something went wrong in request otp" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer?._id);
    if (profile) {
      return res.json(profile);
    }
  }
  return res
    .status(500)
    .json({ message: "Something went wrong in request otp" });
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profileInput = plainToClass(EditCustomerProfileInput, req.body);
    const inputErrors = await validate(profileInput, {
      validationError: { target: false },
    });
    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }
    const { firstName, lastName, address } = profileInput;
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();
      return res.json(result);
    }
    return res.status(400).json({ message: "Profile not found." });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong in request otp" });
};
