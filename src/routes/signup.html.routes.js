import express from "express";

export const signupRouter = express.Router();

signupRouter.get("/", (req, res) => {
    return res.status(200).render("signup", {});
  });