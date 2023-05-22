import express from "express";
import { products } from "./products.routes.js";

export const home = express.Router();

home.get("/", (req, res) => {
  const title = "ALL PRODUCTS";
  return res
    .status(200)
    .render("home", { title, products });
});