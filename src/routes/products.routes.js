import express from "express";
import { __dirname } from "../config.js"
import { ProductsService } from "../services/products.service.js";
import { ProductsModel } from "../DAO/models/products.model.js";
import { uploader } from "../utils/multer.js";

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const {currentPage, prodLimit, sort, query} = req.query
    const sortOption = sort === "asc" ? {price: 1} : sort === "desc" ? {price: -1} : {}
    const filter = {};
    if (query === "tablet" || query === "celphone" || query === "notebook") {
      filter.category = query;
    }
    if (query === "available") {
      filter.stock = { $gt: 0 };
    }
    const queryResult = await ProductsModel.paginate(filter, {sort: sortOption, limit: prodLimit || 10, page: currentPage || 1})
    let paginatedProd = queryResult.docs
    const { totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage } = queryResult
    paginatedProd = paginatedProd.map((prod) => ({
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock,
        category: prod.category
    }))
    const prevLink = hasPrevPage ? `/api/products?currentPage=${queryResult.prevPage}&prodLimit=${prodLimit ? prodLimit : ""}&sort=${sort ? sort : ""}&query=${query ? query : ""}` : null
    const nextLink = hasNextPage ? `/api/products?currentPage=${queryResult.nextPage}&prodLimit=${prodLimit ? prodLimit : ""}&sort=${sort ? sort : ""}&query=${query ? query : ""}` : null
    return res.status(200).json({
      status: "success",
      msg: "Listado de productos",
      payload: {paginatedProd, totalDocs, limit, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink}
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