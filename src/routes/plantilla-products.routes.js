import express from "express";
import { products } from "./products.routes.js";

export const plantillaProducts = express.Router();

plantillaProducts.get("/", (req, res) => {
  const title = "Un hermoso titulo que hable sobre boquita!";
  return res
    .status(200)
    .render("plantilla-products", { title, products });
});