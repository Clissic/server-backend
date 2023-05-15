import express from "express";
import { CartManager } from "../functions/CartManager.js";
import { products } from "./products.routes.js";
export const cartsRouter = express.Router();

const cartManager = new CartManager("src/utils/carts.json");

cartsRouter.post("/", (req, res) => {
  const products = [];
  const cart = cartManager.createCart(products);
  return res
    .status(200)
    .json({ status: "succes", msj: "Cart created succesfuly", data: cart });
});

cartsRouter.get("/:cid", (req, res) => {
  const cid = req.params.cid;
  const cartByCId = cartManager.getCartsById(cid);
  if (cartByCId) {
    return res
      .status(200)
      .json({
        status: "succes",
        msj: "Cart by ID found",
        data: cartByCId.products,
      });
  } else {
    return res
      .status(404)
      .json({ status: "error", msj: "Cart does not exist", data: {} });
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const prodToAdd = products.find((prod) => prod.id === pid);
  const product = { id: prodToAdd.id, quantity: 1 };
  cartManager.addProductToCart(cid, product);
  return res
    .status(201)
    .json({
      status: "success",
      msj: "Product added to cart",
      data: product,
    });
});
