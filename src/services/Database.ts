import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    console.log("Connecting to DB.");

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log("DB connected.");
  } catch (error) {
    console.log(error);
  }
};
