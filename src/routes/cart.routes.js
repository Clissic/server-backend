import express from "express";
import { CartsModel } from "../DAO/models/carts.model.js";

export const cartRouter = express.Router();

cartRouter.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const mainTitle = "CART"
        const cart = await CartsModel.findById(cid).populate(
            "products.product",
        )
        if (!cart) {
            return res
            .status(404)
            .json({
                status: "error",
                message: "Cart does not exist",
                payload: {}
            })
        }
        return res.status(200).render("cart", { cart: cart.toObject() , mainTitle })
    } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to render cart",
      payload: {},
    });
  }
})