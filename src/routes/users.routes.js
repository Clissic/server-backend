import express from "express";
import { UserService } from "../services/users.service.js";

export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await UserService.getAll();
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
    const user = await UserService.findById(id);
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
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
      console.log(
        "Validation error: please complete firstName, lastName and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "Please complete firstName, lastName and email.",
        payload: {},
      });
    }
    const userCreated = await UserService.create({ first_name, last_name, email });
    return res.status(201).json({
      status: "success",
      msg: "User created",
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

usersRouter.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email || !_id) {
      console.log(
        "Validation error: please complete firstName, lastName and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "Please complete firstName, lastName and email.",
        payload: {},
      });
    }
    try {
      const userUpdated = await UserService.updateOne({
        _id,
        first_name,
        last_name,
        email,
      });
      console.log(userUpdated);
      if (userUpdated.matchedCount > 0) {
        return res.status(201).json({
          status: "success",
          msg: "User updated",
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
      return res.status(500).json({
        status: "error",
        msg: "db server error while updating user",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await UserService.deleteOne({ _id });

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