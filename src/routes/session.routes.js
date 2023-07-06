import express from "express";
import passport from "passport";

export const sessionsRouter = express.Router();

sessionsRouter.post("/signup", passport.authenticate('register', { failureRedirect: '/error-auth' }), async (req, res) => {
  if (!req.user) {
    return res.render("errorPage", { msg: "Something went wrong."})
  }
  req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role, cartId: req.user.cartId}

  return res.redirect("/")
});

sessionsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/error-auth' }), async (req, res) => {
  try {
    if (!req.user) {
      return res.render("errorPage", { msg: 'User email or password are incorrect.' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role, cartId: req.user.cartId}
    console.log(req.session.user)
    return res.redirect("/products");
  } catch (err) {
    console.error(err);
    return res.status(500).render("errorPage",{ msg: 'Internal Server Error' });
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
    req.session.age = req.user.age;
    req.session.role = req.user.role;
    req.session.cartId = req.user.cartId;
    res.redirect("/products")
  }
);

/* Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
  passport: { user: '64a64b47d242b89d77dfd17f' },
  email: 'joaquin.perez.coria@gmail.com',
  first_name: 'JPC',
  last_name: 'noLast',
  age: 0,
  role: 'user',
  cartId: { products: [], _id: '64a64b47d242b89d77dfd17d', __v: 0 }
} */

