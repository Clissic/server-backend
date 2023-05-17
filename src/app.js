import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { __dirname } from "./dirname.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { plantillaProducts } from "./routes/plantilla-products.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { socketRouter } from "./routes/socket.routes.js";

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

// CONFIG DEL MOTOR DE PLANTILLAS:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// MIS ENDPOINTS TIPO API REST/JSON:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Example app listening http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log("Quedo conectado el socket " + socket.id)

    socket.on("msj", (data) => {
        socketServer.emit("msj", data)
    })
})

//QUIERO DEVOLVER HTML DIRECTO PAGINA COMPLETA ARMADA EN EL BACK
app.use("/plantilla-products", plantillaProducts);
app.use("/socket", socketRouter);

app.get("*", (req, res) => {
    return res
        .status(404)
        .json({status:"error", msj: "Route does not exist", data: {}})
})