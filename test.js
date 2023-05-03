class ProductManager {
  products = [];
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
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
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const product = this.products.find((prod) => prod.id === id);
    if (product) {
      return product;
    } else {
      return console.error("Not found");
    }
  }
}

const productM = new ProductManager();