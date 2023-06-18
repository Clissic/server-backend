import express from "express";
import { ProductsService } from "../services/products.service.js";
import { uploader } from "../utils/multer.js";

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try { // NO FUNCIONA EL LIMIT -- CONSULTAR --
/*     let { limit } = req.query; */
    let /* query */ products = await ProductsService.findAll();
/*     if (limit) {
      query = query.limit(Number(limit));
    }
    const products = await query.exec(); */
    return res.status(200).json({
      status: "success",
      msg: "Listado de productos",
      payload: products
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductsService.findById(id);
    if (product) {
      return res.status(200).json({
        status: "success",
        message: "Product by ID found",
        payload: product,
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
    const newProduct = ProductsService.create(title, description, price, thumbnail, code, stock, category);
    return res
      .status(201)
      .json({
        status: "success",
        message: "Product created",
        payload: newProduct,
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;
    const updatedProduct = await ProductsService.findByIdAndUpdate(id, dataToUpdate,);
    if (updatedProduct) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Product modified successfully",
          payload: updatedProduct,
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
    const { id } = req.params;
    const deletedProduct = await ProductsService.findByIdAndDelete(id);
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