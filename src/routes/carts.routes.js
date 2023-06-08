import express from "express";
import { CartsModel } from "../models/carts.model.js";
import { ProductsModel } from "../models/products.model.js";

export const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await CartsModel.create({ products: [] });
    return res.status(200).json({
      status: "success",
      message: "Cart created successfully",
      data: cart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Failed to create cart", data: {} });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartsModel.findById(cid).populate(
      "products.product",
      "id"
    );

    if (cart) {
      return res.status(200).json({
        status: "success",
        message: "Cart found",
        data: cart.products,
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", data: {} });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Failed to get cart", data: {} });
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
        .json({ status: "error", message: "Product does not exist", data: {} });
    }
    const cart = await CartsModel.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", data: {} });
    }
    const existingProduct = cart.products.find(
      (product) => product.product.toString() === pid
    );
    if (existingProduct) {
      await CartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } }
      );
    } else {
      cart.products.push({ product: pid, quantity: 1 });
      await cart.save();
    }
    return res
      .status(201)
      .json({
        status: "success",
        message: "Product added to cart",
        data: productToAdd,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Failed to add product to cart",
        data: {},
      });
  }
});

/* import express from "express";
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
 */
