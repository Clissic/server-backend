import express from "express";

export const socketRouter = express.Router();

socketRouter.get("/", (req, res) => {
  return res.status(200).render("socket", {});
});