import express from "express";
import { UserModel } from "../DAO/models/users.model.js";
import { CartsService } from "../services/carts.service.js";

export const sessionsRouter = express.Router();

sessionsRouter.post("/signup", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exist = await UserModel.findOne({ email });
  if (exist) {
    res.send("This email is already in use");
  } else {
    await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role: "user",
      cartId: await CartsService.create(),
    });
    res.redirect("/");
  }
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.email = email;
      req.session.first = "Coder";
      req.session.last = "House";
      req.session.role = "admin";
      req.session.cartId = {
        products: [],
        _id: "649bc62e6fff7c09f188cf8d",
        __v: 0,
      };
    } else {
      user = await UserModel.findOne({ email, password });
      if (!user) {
        return res.render("errorPage", {
          msg: "User email or password are incorrect.",
        });
      }
      req.session.email = user.email;
      req.session.first = user.first_name;
      req.session.last = user.last_name;
      req.session.role = user.role;
      req.session.cartId = user.cartId;
    }

    return res.redirect("/products");
  } catch (error) {
    console.error(error);
    return res.status(500).render("errorPage", {
      msg: "Error 500. Internal server error.",
    });
  }
});


sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.render("errorPage", { msg: "Logout error."})
    }
    res.redirect("/")
  })
})