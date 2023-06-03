import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { __dirname } from "./dirname.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { home } from "./routes/home.routes.js";
import { productManager, productsRouter } from "./routes/products.routes.js";
import { realTimeProducts } from "./routes/real-time-products.routes.js";
import { testChatRouter } from "./routes/test-chat.routes.js";
import { connectMongo } from "./utils/utils.js";

const app = express()
const PORT = 8080

connectMongo()

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
    console.log(`App running on ${__dirname} - server http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log("Connected to socket " + socket.id)

    socket.on("msj", (data) => {
        socketServer.emit("msj", data)
    })
    
    // ELIMINAR PRODUCTO
    socket.on("productIdToBeRemoved", (id) => {
        let prodDeleted = {}
        socketServer.emit("productDeleted", prodDeleted =
            productManager.deleteProduct(id)
        )
    })

    // AGREGAR PRODUCTO
    socket.on("addProduct", (newProduct) => {
        let newProducts = productManager.createProduct(
            newProduct.title, 
            newProduct.description, 
            newProduct.price, 
            newProduct.thumbnail, 
            newProduct.code, 
            newProduct.stock, 
            newProduct.category
        )
        socketServer.emit("productAdded", newProducts )
    })

    // TEST CHAT
    let msgs = [];
        socket.on("msg_front_to_back", (msg) => {
        msgs.push(msg);
        socketServer.emit("listado_de_msgs", msgs);
  });
})

//QUIERO DEVOLVER HTML DIRECTO PAGINA COMPLETA ARMADA EN EL BACK
app.use("/home", home);
app.use("/test-chat", testChatRouter);
app.use("/realtimeproducts", realTimeProducts)

app.get("*", (req, res) => {
    return res
        .status(404)
        .json({status:"error", msj: "Route does not exist", data: {}})
})