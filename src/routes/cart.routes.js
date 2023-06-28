import express from "express";
import { CartsModel } from "../DAO/models/carts.model.js";

export const cartRouter = express.Router();

cartRouter.get("/:cid", async (req, res) => {
  try {
    const user = req.session;
    const cid = req.params.cid;
    const mainTitle = "CART";
    const cart = await CartsModel.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).render(
        "errorPage",
        { msg: "Cart not found"}
      );
    }
    return res.status(200).render("cart", { cart: cart.toObject(), mainTitle, user });
  } catch (error) {
          return res.status(500).render(
        "errorPage",
        { msg: "Error 500. Cart could not be rendered."}
      );
  }
});
