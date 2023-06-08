import express from "express";
import { ProductsModel } from "../models/products.model.js";

export const home = express.Router();

home.get("/", async (req, res) => {
  try {
    const products = await ProductsModel.find().lean();
    const mainTitle = "ALL PRODUCTS";
    return res.status(200).render("home", { mainTitle, products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch products", data: {} });
  }
});
