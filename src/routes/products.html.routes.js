import express from "express";
import { ProductsModel } from "../DAO/models/products.model.js";

export const products = express.Router();

products.get("/", async (req, res) => {
  try {
    let user = req.session.user;
    if (!user) {
      user = {
        email: req.user ? req.user.email : req.session.email,
        first_name: req.user ? req.user.first_name : req.session.first_name,
        last_name: req.user ? req.user.last_name : req.session.last_name,
        age: req.user ? req.user.age : req.session.age,
        role: req.user ? req.user.role : req.session.role,
        cartId: req.user ? req.user.cartId : req.session.cartId,
      };
    }
    console.log(user)
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

    const mainTitle = "ALL PRODUCTS";
    return res.status(200).render("products", { user, query, sort, prodLimit, mainTitle, paginatedProd, totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage, prevLink, nextLink});
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return res
      .status(500)
      .render("errorPage", { msg: "Error 500. Failed to fetch products." });
  }
});
