import express from "express";
import { CartsModel } from "../DAO/models/carts.model.js";

export const cartRouter = express.Router();

cartRouter.get("/:cid", async (req, res) => {
  try {
    let user = req.session.user;
    if (!user) {
      user = {
        email: req.user ? req.user.email : req.session.email,
        first_name: req.user ? req.user.first_name : req.session.first_name,
        last_name: req.user ? req.user.last_name : req.session.last_name,
        age: req.user ? req.user.age : req.session.age,
        role: req.user ? req.user.role : req.session.role,
        cartId: req.user ? req.user.cartId : req.session.cartId,
      };
    }
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
