import express from "express";
import { ProductManager } from './ProductManager.js'

const productManager = new ProductManager('src/product.json')
const products = productManager.getAllProducts()

const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))

app.get("/products", (req, res) => {
    let {limit} = req.query;
    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(products)
    }
})

app.get("/products/:id", (req, res) => {
    const id = req.params.id
    const productById = productManager.getProductsById(id)
    if (productById) {
        res.json(productById)
    } else {
        res.json({error: "Product does not exist"})
    }

})

app.listen(PORT, () => {
    console.log(`Example app listenind on port ${PORT}`)
})