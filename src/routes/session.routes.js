import express from "express";
import passport from "passport";
import { UserModel } from "../DAO/models/users.model.js";
import { CartsService } from "../services/carts.service.js";
import { UserService } from "../services/users.service.js";
import { createHash, } from "../utils/Bcrypt.js";

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
      password: createHash(password),
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
      user = await UserService.findUser( email, password );
      if (user) {
        req.session.email = user.email;
        req.session.first_name = user.first_name;
        req.session.last_name = user.last_name;
        req.session.role = user.role;
        req.session.cartId = user.cartId;
      } else {
        return res.render("errorPage", {
          msg: "User email or password are incorrect.",
        });
      }
    }
    console.log(user)
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

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
  );

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/error-auth" }),
  (req, res) => {
    req.session.email = req.user.email;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.role = req.user.role;
    req.session.cartId = req.user.cartId;
    res.redirect("/products")
  }
);