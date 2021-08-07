import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Vendor } from "../models";

export const GetFoodAvailablity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode, serviceAvailable: false })
    .sort({
      rating: "desc",
    })
    .populate("foods");

  if (result.length > 0) {
    return res.json(result);
  }
  return res.status(400).json({ message: "Data not found!" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode, serviceAvailable: false })
    .sort({
      rating: "desc",
    })
    .limit(10)
    .select("-foods");

  if (result.length > 0) {
    return res.json(result);
  }
  return res.status(400).json({ message: "Data not found!" });
};

export const GetFoodsIn30Mins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.json(foodResult);
  }
  return res.status(400).json({ message: "Data not found!" });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((item) => {
      foodResult.push(...item.foods);
    });
    return res.json(foodResult);
  }
  return res.status(400).json({ message: "Data not found!" });
};

export const RestaurantsByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await Vendor.findById(req.params.id).populate("foods");
  if (result) {
    return res.json(result);
  }
  return res.status(400).json({ message: "Data not found!" });
};
