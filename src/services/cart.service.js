import { CartsModel } from "../DAO/models/carts.model.js";

class cartsService {
    async create() {
        const cart = await CartsModel.create({products: []});
        return cart
    }

    async findById(cid) {
        const cart = await CartsModel.findById(cid).populate(
            "products.product",
            "id"
        )
        return cart
    }

    async findOneAndUpdate(cid, pid) {
        await CartsModel.findOneAndUpdate(
            { _id: cid, "products.product": pid },
            { $inc: { "products.$.quantity": 1 } }
        );
    }
}

export const CartsService = new cartsService();