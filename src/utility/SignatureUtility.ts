import jwt from "jsonwebtoken";
import { Request } from "express";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../dto";

export const GenerateSignature = async (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    ) as AuthPayload;

    req.user = payload;
    return true;
  }
  return false;
};
