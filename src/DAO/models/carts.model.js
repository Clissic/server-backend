import { Schema, model } from "mongoose";

const schema = new Schema({
  products: { type: Array }
});

export const CartsModel = model("carts", schema);