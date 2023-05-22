import express from "express";
import { products } from "./products.routes.js";

export const realTimeProducts = express.Router();

realTimeProducts.get("/", (req, res) => {
  const title = "REAL TIME PRODUCTS";
  return res
    .status(200)
    .render("real-time-products", { title, products });
});