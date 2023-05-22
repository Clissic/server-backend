import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { __dirname } from "./dirname.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { plantillaProducts } from "./routes/plantilla-products.routes.js";
import { productManager, productsRouter } from "./routes/products.routes.js";
import { realTimeProducts } from "./routes/real-time-products.routes.js";
import { testChatRouter } from "./routes/test-chat.routes.js";

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public", { extensions: ['html', 'js'] }))

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
    console.log("Quedo conectado el socket " + socket.id)

    socket.on("msj", (data) => {
        socketServer.emit("msj", data)
    })
    
    // ELIMINAR PRODUCTO
    socket.on("productIdToBeRemoved", (id) => {
        let prodDeleted = {}
        socketServer.emit("productDeleted", prodDeleted = () => {
            productManager.deleteProduct(id)
        })
    })

    // AGREGAR PRODUCTO
    socket.on("addProduct", (newProduct) => {
        let newProducts = []
        socketServer.emit("productAdded", newProducts = () => {
            productManager.createProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock, newProduct.category)
        })
    })
})

//QUIERO DEVOLVER HTML DIRECTO PAGINA COMPLETA ARMADA EN EL BACK
app.use("/plantilla-products", plantillaProducts);
app.use("/test-chat", testChatRouter);
app.use("/realtimeproducts", realTimeProducts)

app.get("*", (req, res) => {
    return res
        .status(404)
        .json({status:"error", msj: "Route does not exist", data: {}})
})