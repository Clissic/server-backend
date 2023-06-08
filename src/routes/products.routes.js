import express from "express";
import { uploader } from "../utils/utils.js";
import { ProductsModel } from "../models/products.model.js";

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    let { limit } = req.query;
    let query = ProductsModel.find();
    if (limit) {
      query = query.limit(Number(limit));
    }
    const products = await query.exec();
    return res.status(200).json({status: "success",
    msg: "Listado de productos",
    data: products});
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductsModel.findById(id);
    if (product) {
      return res.status(200).json({
        status: "success",
        message: "Product by ID found",
        data: product,
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.post("/", uploader.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "Uploading a file is mandatory" });
    }
    const { title, description, price, code, stock, category } = req.body;
    const thumbnail = req.file.filename;
    const newProduct = new ProductsModel({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    });
    await newProduct.save();
    return res
      .status(201)
      .json({
        status: "success",
        message: "Product created",
        data: newProduct,
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      id,
      dataToUpdate,
      {
        new: true,
      }
    );
    if (updatedProduct) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Product modified successfully",
          data: updatedProduct,
        });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedProduct = await ProductsModel.findByIdAndDelete(_id);
    if (deletedProduct) {
      return res
        .status(200)
        .json({ status: "success", message: "Product deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* import express from "express";
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
}) */
