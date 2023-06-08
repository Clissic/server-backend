import express from "express";
import { ProductsModel } from "../models/products.model.js";

export const realTimeProducts = express.Router();

realTimeProducts.get("/", async (req, res) => {
  try {
    const products = await ProductsModel.find().lean();
    const mainTitle = "REAL TIME PRODUCTS";
    return res.status(200).render("real-time-products", { mainTitle, products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return res.status(500).json({ status: "error", message: "Failed to fetch products", data: {} });
  }
});