import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

export async function connectMongo() {
  try {
    await connect(
      `mongodb+srv://joaquinperezcoria:${process.env.MONGODB_PASSWORD}@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "Can not connect to the db";
  }
}