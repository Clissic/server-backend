import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./config.js";
import { cartRouter } from "./routes/cart.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { products } from "./routes/products.html.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProducts } from "./routes/real-time-products.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { connectMongo } from "./utils/db-connection.js";
import { connectSocketServer } from "./utils/sockets-server.js";

const app = express();
const PORT = 8080;
connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// CONFIG DEL MOTOR DE PLANTILLAS:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

const httpServer = app.listen(PORT, () => {
  console.log(
    `App running on ${__dirname} - server http://localhost:${PORT}`
  );
});

connectSocketServer(httpServer);

app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);

app.use("/products", products);
app.use("/chat", chatRouter);
app.use("/realtimeproducts", realTimeProducts);
app.use("/cart", cartRouter);

app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msj: "Route does not exist", payload: {} });
});
