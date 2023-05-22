import express from "express";

export const testChatRouter = express.Router();

testChatRouter.get("/", (req, res) => {
  return res.status(200).render("test-chat", {});
});