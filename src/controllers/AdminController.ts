import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) return await Vendor.findOne({ email });
  else return await Vendor.findById(id);
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pincode,
    address,
    email,
    phone,
    password,
    foods,
  } = <CreateVendorInput>req.body;

  const checkVendor = await findVendor("", email);
  if (checkVendor != null) {
    return res.json({ message: "Vendor already exists." });
  }

  // generate salt
  const salt = await GenerateSalt();

  // create hashed password
  const hashedPassword = await GeneratePassword(password, salt);

  const createVendor = await Vendor.create({
    name,
    ownerName,
    foodType,
    pincode,
    address,
    email,
    phone,
    password: hashedPassword,
    salt,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods,
  });

  return res.json(createVendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();
  if (vendors !== null) {
    return res.json(vendors);
  }
  return res.json({ message: "Vendor data not found." });
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = await findVendor(req.params.id);
  if (vendor !== null) {
    return res.json(vendor);
  }
  return res.json({ message: "Vendor data not found." });
};
