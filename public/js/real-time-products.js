const socket = io();

const getDeleteBtns = document.getElementsByClassName("deleteButton");
const getAddProductSubmitBtn = document.getElementById("addProductSubmitBtn");

// ELIMINAR UN PRODUCTO CON WEBSOCKETS
for (let i = 0; i < getDeleteBtns.length; i++) {
  getDeleteBtns[i].addEventListener("click", function () {
    let id = this.getAttribute("data-id");
    socket.emit("productIdToBeRemoved", id);
    console.log("Product with id: " + id + " was deleted succesfully, please refresh (F5)")
});
}

// Escuchar evento 'productDeleted' del servidor
socket.on("productDeleted", (deletedProduct) => {
  console.log("Product deleted:", deletedProduct);
  // Aquí puedes realizar las actualizaciones necesarias en el front-end,
  // como eliminar el producto de la interfaz o actualizar la lista de productos.
});

// Escuchar evento 'productDeletionError' del servidor
socket.on("productDeletionError", (errorMessage) => {
  console.error("Error deleting product:", errorMessage);
  // Aquí puedes manejar el error y mostrar un mensaje al usuario si es necesario.
});

// AGREGAR UN PRODUCTO CON WEBSOCKETS
getAddProductSubmitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  let thumbnail = document.getElementById("thumbnail").value;
  let title = document.getElementById("title").value;
  let price = document.getElementById("price").value;
  let description = document.getElementById("description").value;
  let code = document.getElementById("code").value;
  let category = document.getElementById("category").value;
  let stock = document.getElementById("stock").value;

  let newProduct = {
    thumbnail,
    title,
    price,
    description,
    code,
    category,
    stock,
  };

  socket.emit("addProduct", newProduct);
});

socket.on("productAdded", (createdProduct) => {
  console.log("Product added:", createdProduct);
});

socket.on("productCreationError", (errorMessage) => {
  console.error("Error creating product:", errorMessage);
});