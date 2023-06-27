import express from "express";

export const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
    return res.status(200).render("login", {});
  });