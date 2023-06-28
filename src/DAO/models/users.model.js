import { Schema, model } from "mongoose";

const schema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  age: { type: Number, required: true},
  password: { type: String, required: true, max: 100 },
  role: { type: String},
  cartId: { type: Object },
});

export const UserModel = model("users", schema);