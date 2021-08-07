import Mongoose, { Document, Schema } from "mongoose";

export interface FoodDoc extends Document {
  vendorId: string;
  name: string;
  category: string;
  description: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: Mongoose.SchemaTypes.ObjectId, ref: "vendor" },
    name: { type: String, required: true },
    category: { type: String },
    description: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const Food = Mongoose.model<FoodDoc>("food", FoodSchema);

export { Food };
