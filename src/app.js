import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

// MIS ENDPOINTS:
app.use("/products", productsRouter);
app.use("/carts", cartsRouter)

app.get("*", (req, res) => {
    return res
        .status(404)
        .json({status:"error", msj: "Route does not exist", data: {}})
})

app.listen(PORT, () => {
    console.log(`Example app listenind http://localhost:${PORT}`)
})