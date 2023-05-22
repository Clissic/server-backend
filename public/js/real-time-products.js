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

socket.on("productDeleted", (prodDeleted) => {
  products = prodDeleted;
});

// AGREGAR UN PRODUCTO CON WEBSOCKETS
getAddProductSubmitBtn.addEventListener("click", (event) => {
  const stringToDelete = "C:\\fakepath\\";

  let thumbnail = document.getElementById("thumbnail").value.replace(stringToDelete, "");
  let title = document.getElementById("title").value;
  let price = document.getElementById("price").value;
  let description = document.getElementById("description").value;
  let code = document.getElementById("code").value;
  let category = document.getElementById("category").value;
  let stock = document.getElementById("stock").value;
  
  newProduct = {thumbnail, title, price, description, code, category, stock}

  socket.emit("addProduct", newProduct);
})

socket.on("productAdded", (newProducts) => {
  products = newProducts
} )