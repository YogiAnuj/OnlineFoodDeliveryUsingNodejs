import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { comparePassword } from "../utility";
import { GenerateSignature } from "../utility/SignatureUtility";
import { findVendor } from "./AdminController";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;
  const vendor = await findVendor(undefined, email);
  if (vendor !== null) {
    // validation and give access
    const validation = await comparePassword(password, vendor.password);
    if (validation) {
      const signature = await GenerateSignature({
        _id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        foodType: vendor.foodType,
      });

      return res.json(signature);
    } else return res.json({ message: "Invalid password" });
  }
  return res.json({ message: "Login credential not valid." });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    return res.json(await findVendor(user._id));
  } else return res.json({ message: "Vendor credential not found." });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, address, foodType } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const vendor = await findVendor(user._id);
    if (vendor !== null) {
      vendor.name = name;
      vendor.phone = phone;
      vendor.address = address;
      vendor.foodType = foodType;

      const savedResult = await vendor.save();
      return res.json(savedResult);
    }
    return res.json(vendor);
  } else return res.json({ message: "Vendor credential not found." });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await findVendor(user._id);
    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const savedResult = await vendor.save();
      return res.json(savedResult);
    }
    return res.json(vendor);
  } else return res.json({ message: "Vendor credential not found." });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await findVendor(user._id);
    if (vendor !== null) {
      vendor.serviceAvailable = !vendor.serviceAvailable;

      const savedResult = await vendor.save();
      return res.json(savedResult);
    }
    return res.json(vendor);
  } else return res.json({ message: "Vendor credential not found." });
};
