import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 1000 },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: false},
  code: { type: String, required: true, unique: true},
  stock: { type: Number, require: true},
  category: { type: String, require: true, max: 100},
});

export const ProductsModel = model("products", schema);