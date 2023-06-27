import express from "express";
import { UserModel } from "../DAO/models/users.model.js";

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
    });
    res.redirect("/");
  }
});