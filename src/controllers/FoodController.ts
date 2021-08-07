import { Request, Response, NextFunction } from "express";
import { FoodInput } from "../dto";
import { Food } from "../models";
import { findVendor } from "./AdminController";

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      FoodInput
    >req.body;

    const vendor = await findVendor(user._id);
    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createdFood = await Food.create({
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        vendorId: vendor.id,
        images,
        rating: 0,
      });

      vendor.foods.push(createdFood);
      const result = await vendor.save();
      return res.json(result);
    }
  }
  return res.json({ message: "Something went wrong with add food." });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
    return res.json({ message: "No food available." });
  }
  return res.json({ message: "Foods information not found." });
};

export const GetFoodByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const food = await Food.findById(req.params.id);
    if (food !== null) return res.json(food);
    return res.json({ message: "Food information not found." });
  }
  return res.json({ message: "Food not found." });
};
