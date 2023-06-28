import { Server } from "socket.io";
import { ProductsModel } from "../DAO/models/products.model.js";
import { MsgModel } from "../DAO/models/msgs.model.js";
import { CartsModel } from "../DAO/models/carts.model.js";
import { CartsService } from "../services/carts.service.js";

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("Connected to socket " + socket.id);
  });
  // TEST CHAT
  socketServer.on("connection", (socket) => {
    socket.on("msg_front_to_back", async (msg) => {
      try {
        await MsgModel.create(msg);
      } catch (e) {
        console.log(e);
      }
      try {
        const msgs = await MsgModel.find({});
        socketServer.emit("listado_de_msgs", msgs);
      } catch (e) {
        console.log(e);
      }
    });
  });
  // ELIMINAR PRODUCTO
  socketServer.on("connection", (socket) => {
    socket.on("productIdToBeRemoved", async (id) => {
      try {
        const productDeleted = await ProductsModel.findByIdAndDelete(id);
        const deletedAndUpdatedProducts = await ProductsModel.find();
        socketServer.emit(
          "productDeleted",
          deletedAndUpdatedProducts,
          productDeleted
        );
      } catch (error) {
        console.error(error);
        socketServer.emit("productDeletionError", error.message);
      }
    });
    // AGREGAR PRODUCTO
    socket.on("addProduct", async (newProduct) => {
      try {
        const createdProduct = await ProductsModel.create(newProduct);
        const createdAndUpdatedProducts = await ProductsModel.find();
        socket.emit("productAdded", createdAndUpdatedProducts, createdProduct);
      } catch (error) {
        console.error(error);
        socket.emit("productCreationError", error.message);
      }
    });
  });

  // AGREGAR PRODUCTO AL CARRITO
  socketServer.on("connection", (socket) => {
    socket.on("productIdToBeAdded", async (id) => {
      try {
        const findCart = await CartsModel.findById("649b9ae2f6e9f77b88bbcd5c");
        const cid = findCart._id;
        const pid = id;
        const productToAdd = await ProductsModel.findById(pid);
        if (!productToAdd) {
          return res
            .status(404)
            .json({
              status: "error",
              message: "Product does not exist",
              payload: {},
            });
        }
        const cart = await CartsService.findById(cid);
        if (!cart) {
          return res
            .status(404)
            .json({
              status: "error",
              message: "Cart does not exist",
              payload: {},
            });
        }
        const existingProduct = cart.products.find(
          (product) => product.product.toString() === pid
        );
        if (existingProduct) {
          await CartsService.findOneAndUpdate(cid, pid);
        } else {
          cart.products.push({ product: pid, quantity: 1 });
          await cart.save();
        }
        socket.emit("productAddedToCart", cart);
        console.log(cart);
      } catch (error) {
        console.error(error);
        socket.emit("productAddToCartError", error.message);
      }
    });
  });
}