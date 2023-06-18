import express from "express";
import { ProductsModel } from "../DAO/models/products.model.js";
import { CartsService } from "../services/cart.service.js";

export const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await CartsService.create();
    return res.status(200).json({
      status: "success",
      message: "Cart created successfully",
      payload: cart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Failed to create cart", payload: {} });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartsService.findById(cid);

    if (cart) {
      return res.status(200).json({
        status: "success",
        message: "Cart found",
        payload: cart.products,
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", payload: {} });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Failed to get cart", payload: {} });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const productToAdd = await ProductsModel.findById(pid);
    if (!productToAdd) {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist", payload: {} });
    }
    const cart = await CartsService.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", payload: {} });
    }
    const existingProduct = cart.products.find(
      (product) => product.product.toString() === pid
    );
    if (existingProduct) {
      await CartsService.findOneAndUpdate(cid, pid);
    } else {
      cart.products.push({ product: pid, quantity: 1 });
      await cart.save();
    }
    return res
      .status(201)
      .json({
        status: "success",
        message: "Product added to cart",
        payload: productToAdd,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Failed to add product to cart",
        payload: {},
      });
  }
});