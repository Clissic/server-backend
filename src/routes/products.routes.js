import express from "express";
import { ProductManager } from '../functions/ProductManager.js'
import { uploader } from "../utils/utils.js";
export const productsRouter = express.Router();

export const productManager = new ProductManager('src/utils/products.json')
export const products = productManager.getAllProducts()

productsRouter.get("/", (req, res) => {
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

productsRouter.get("/:id", (req, res) => {
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

productsRouter.post("/", uploader.single("file"), (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({status: "error", msj: "To upload a file is mandatory", data: {}})
    }
    const {title, description, price, code, stock, category} = req.body
    let thumbnail = []
    thumbnail.push(req.file.filename)
    const productToAdd = productManager.createProduct(title, description, price, thumbnail, code, stock, category)
    return res
        .status(201)
        .json({status: "succes", msj: "Product created", data: productToAdd})
})

productsRouter.put("/:id", (req, res) => {
    const id = req.params.id
    const dataToUpdate = req.body
    const modifiedProduct = productManager.updateProduct(id, dataToUpdate)
    return res
        .status(200)
        .json({status: "succes", msj: "Product modified succesfuly", data: modifiedProduct})
})

productsRouter.delete("/:id", (req, res) => {
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