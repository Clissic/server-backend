import express from "express";
import { products } from "./products.routes.js";

export const plantillaProducts = express.Router();

plantillaProducts.get("/", (req, res) => {
  const title = "ALL PRODUCTS";
  return res
    .status(200)
    .render("plantilla-products", { title, products });
});