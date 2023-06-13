import express from "express";
import { UserModel } from "../DAO/models/users.model.js";

export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find(
      {},{
        _id: true,
        firstName: true,
        lastName: true,
        email: true,
      });
    return res.status(200).json({
      status: "success",
      msg: "All users found",
      payload: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (user) {
      return res.status(200).json({
        status: "success",
        message: "User by ID found",
        payload: user,
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "User does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

usersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      console.log(
        "Validation error: please complete firstName, lastName and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "Please complete firstName, lastName and email.",
        payload: {},
      });
    }
    const userCreated = await UserModel.create({ firstName, lastName, email });
    return res.status(201).json({
      status: "success",
      msg: "user created",
      payload: userCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email || !id) {
      console.log(
        "Validation error: please complete firstName, lastName and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "Please complete firstName, lastName and email.",
        payload: {},
      });
    }
    const userUptaded = await UserModel.updateOne(
      { _id: id },
      { firstName, lastName, email }
    );
    if (userUptaded.matchedCount > 0) {
      return res.status(201).json({
        status: "success",
        msg: "User uptaded",
        payload: {},
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "User not found",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserModel.deleteOne({ _id: id });

    if (result?.deletedCount > 0) {
      return res.status(200).json({
        status: "success",
        msg: "User deleted",
        payload: {},
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "User not found",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong :(",
      payload: {},
    });
  }
});