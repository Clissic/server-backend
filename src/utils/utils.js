import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

import { connect } from "mongoose";

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://joaquinperezcoria:Qu7t3hewzxw.@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "Can not connect to the db";
  }
}