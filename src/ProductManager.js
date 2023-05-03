import fs from 'fs';

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    const productsString = fs.readFileSync("src/products.json", "utf-8");
    const products = JSON.parse(productsString);
    this.products = products;
  }

  getAllProducts() {
    return this.products;
  }

  createProduct(title, description, price, thumbnail, code, stock) {
    if (!title) {
      return console.error("A title is required");
    }
    if (!description) {
      return console.error("A description is required");
    }
    if (!price) {
      return console.error("A price is required");
    }
    if (!thumbnail) {
      return console.error("A thumbnail is required");
    }
    if (!code) {
      return console.error("A code is required");
    }
    if (!stock) {
      return console.error("A number of stock is required");
    }

    const notNewProductCode = this.products.find((prod) => prod.code === code);
    if (notNewProductCode) {
      return console.error("This code already exist");
    }

    let actualId = 0;
    this.products.forEach((prod) => {
      if (prod.id > actualId) {
        actualId = prod.id;
      }
    });
    actualId++;

    const addedProduct = {
      id: actualId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(addedProduct);
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync("src/products.json", productsString);
  }

  getProductsById(id) {
    const productsString = fs.readFileSync("src/products.json", "utf-8");
    const products = JSON.parse(productsString);
    this.products = products;
    const product = products.find((prod) => prod.id === id);
    if (product) {
      return product;
    } else {
      return console.error("Not found");
    }
  }

  updateProduct(id, dataToUpdate) {
    // Obtengo el producto mediante su index:
    const productToUpdate = this.products.findIndex((prod) => prod.id === id);
    // Se modifica el producto original con el objeto con los datos actualizados mas el ID porque no queremos modificar:
    const updatedProduct = {
      ...this.products[productToUpdate],
      ...dataToUpdate,
      id
    };
    // Se guardia el producto actualizado en el producto original:
    this.products[productToUpdate] = updatedProduct;
    // Se guarda nuevamente el array this.products en el .json:
    const updatedProductsString = JSON.stringify(this.products);
    fs.writeFileSync("src/products.json", updatedProductsString);
  }

  deleteProduct(id) {
    // Se obtiene el producto a eliminar mediante su index:
    const productToDelete = this.products.findIndex((prod) => prod.id === id);
    // Se valida que el index obtenido si exista:
    if (productToDelete === -1) {
        return console.error("Product does not exist")
    }
    // Con el metodo splice habiendo identificado el index del objeto a eliminar, se elimina 1 lugar:
    this.products.splice(productToDelete, 1);
    // Se guarda nuevamente el array this.products en el .json:
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync("src/products.json", productsString);
  }
}

const productManager = new ProductManager("src/products.json");