import express from "express";
import { CartsModel } from "../DAO/models/carts.model.js";
import { ProductsModel } from "../DAO/models/products.model.js";
import { CartsService } from "../services/carts.service.js";

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
    const cart = await CartsModel.findById(cid).populate(
      "products.product",
  );

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
        .render("errorPage", { msg: "Sorry, product not found."});
    }
    const cart = await CartsService.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .render("errorPage", { msg: "Sorry, cart does not exist."});
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
      .redirect("/cart/" + cid);
  } catch (error) {
    return res
      .status(500)
      .render("errorPage", { msg: "Error 500. Failed to add product to cart."});
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await CartsService.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", payload: {} });
    }
    const productToDeleteIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === pid
    );
    if (productToDeleteIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist in the cart", payload: {} });
    }
    cart.products.splice(productToDeleteIndex, 1);
    await cart.save();
    return res.status(200).json({
      status: "success",
      message: "Product deleted from cart",
      payload: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to delete product from cart",
      payload: {},
    });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const productsToUpdate = req.body.products;
    const cart = await CartsService.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", payload: {} });
    }
    cart.products = productsToUpdate.map((product) => {
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === product.product
      );
      if (existingProduct) {
        return {
          product: product.product,
          quantity: product.quantity || existingProduct.quantity,
        };
      } else {
        return {
          product: product.product,
          quantity: product.quantity,
        };
      }
    });
    await cart.save();
    return res.status(200).json({
      status: "success",
      message: "Products updated in cart",
      payload: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to update products in cart",
      payload: {},
    });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    const cart = await CartsService.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", payload: {} });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist in the cart", payload: {} });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Product quantity updated in cart",
      payload: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to update product quantity in cart",
      payload: {},
    });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartsService.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart does not exist", payload: {} });
    }
    cart.products = [];
    await cart.save();
    return res.status(200).json({
      status: "success",
      message: "All products deleted from cart",
      payload: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to delete products from cart",
      payload: {},
    });
  }
});