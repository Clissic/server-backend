import dotenv from "dotenv";
import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { __dirname } from "./dirname.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { home } from "./routes/home.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProducts } from "./routes/real-time-products.routes.js";
import { testChatRouter } from "./routes/test-chat.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { connectMongo } from "./utils/utils.js";
import { ProductsModel } from "./models/products.model.js";

const app = express();
const PORT = 8080;

dotenv.config();
connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// CONFIG DEL MOTOR DE PLANTILLAS:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// MIS ENDPOINTS TIPO API REST/JSON:
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`App running on ${__dirname} - server http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

let msgs = [];
socketServer.on("connection", (socket) => {
  console.log("Connected to socket " + socket.id);
  // TEST CHAT
  socket.on("msg_front_to_back", (msg) => {
    msgs.push(msg);
    socketServer.emit("listado_de_msgs", msgs);
  });

  // ELIMINAR PRODUCTO
  socket.on("productIdToBeRemoved", async (id) => {
    try {
      const deletedProduct = await ProductsModel.findByIdAndDelete(id);
      socketServer.emit("productDeleted", deletedProduct);
    } catch (error) {
      console.error(error);
      socketServer.emit("productDeletionError", error.message);
    }
  });

  // AGREGAR PRODUCTO
  socket.on("addProduct", async (newProduct) => {
    try {
      const createdProduct = await ProductsModel.create(newProduct);
      socket.emit("productAdded", createdProduct);
    } catch (error) {
      console.error(error);
      socket.emit("productCreationError", error.message);
    }
  });
});

//QUIERO DEVOLVER HTML DIRECTO PAGINA COMPLETA ARMADA EN EL BACK
app.use("/home", home);
app.use("/test-chat", testChatRouter);
app.use("/realtimeproducts", realTimeProducts);

app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msj: "Route does not exist", data: {} });
});
