import express from "express";
import { ProductManager } from './ProductManager.js'

const productManager = new ProductManager('src/product.json')
const products = productManager.getAllProducts()

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// INICIO ENDPOINT PRODUCTS
app.get("/products", (req, res) => {
    let {limit} = req.query;
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        return res.status(200).json(limitedProducts);
    } else {
        return res
            .status(200)
            .json({status: "succes", msj: "All products found", data: products})
    }
})

app.get("/products/:id", (req, res) => {
    const id = req.params.id
    const productById = productManager.getProductsById(id)
    if (productById) {
        return res
            .status(200)
            .json({status: "succes", msj: "Product by ID found", data: productById})
    } else {
        return res
            .status(404)
            .json({status: "error", msj: "Product does not exist", data: {}})
    }
})

// CREAR UN PRODUCTO (NO NECESITO PASAR ID)
app.post("/products", (req, res) => {
    const {title, description, price, thumbnail, code, stock} = req.body
    const productToAdd = productManager.createProduct(title, description, price, thumbnail, code, stock)
    return res
        .status(201)
        .json({status: "succes", msj: "Product created", data: productToAdd})
})

// MODIFICAR UN PRODUCTO (SI NECESITO PASAR ID)
app.put("/products/:id", (req, res) => {
    const id = req.params.id
    const dataToUpdate = req.body
    const modifiedProduct = productManager.updateProduct(id, dataToUpdate)
    return res
        .status(200)
        .json({status: "succes", msj: "Product modified succesfuly", data: modifiedProduct})
})

// BORRAR UN PRODUCTO (SI NECESITO PASAR ID)
app.delete("/products/:id", (req, res) => {
    const id = req.params.id
    const productToDelete = productManager.getProductsById(id)
    if (productToDelete) {
        productManager.deleteProduct(id)
        return res
            .status(200)
            .json({status: "succes", msj: "Product by ID deleted", data: {}})
    } else {
        return res
            .status(404)
            .json({status: "error", msj: "Product does not exist", data: {}})
    }
})
// FIN ENDPOINT PRODUCTS

app.get("*", (req, res) => {
    return res
        .status(404)
        .json({status:"error", msj: "Route does not exist", data: {}})
})

app.listen(PORT, () => {
    console.log(`Example app listenind http://localhost:${PORT}`)
})