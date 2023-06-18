import { ProductsModel } from "../DAO/models/products.model.js";

class productsService {
    async create(title, description, price, thumbnail, code, stock, category) {
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
        return newProduct
    }

    async findAll() {
        const products = await ProductsModel.find({});
        return products
    }

    async findById(id) {
        const product = await ProductsModel.findById(id);
        return product
    }

    async findByIdAndUpdate(id, dataToUpdate) {
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            id,
            dataToUpdate,
            { new: true, }
        );
        return updatedProduct
    }
    
    async findByIdAndDelete(id) {
        const deletedProduct = await ProductsModel.findByIdAndDelete(id);
        return deletedProduct
    }
}

export const ProductsService = new productsService();