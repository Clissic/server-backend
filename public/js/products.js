/* const socket = io();

const getAddBtns = document.getElementsByClassName("addToCartBtn");

// AGREGAR UN PRODUCTO AL CARRITO CON WEBSOCKETS
for (let i = 0; i < getAddBtns.length; i++) {
  getAddBtns[i].addEventListener("click", function () {
    let id = this.getAttribute("data-id");
    socket.emit("productIdToBeAdded", id);
    console.log(
      "Product with id: " + id + " was added succesfully, please refresh (F5)"
    );
  });
}

socket.on("productAddedToCart", async (findCart) => {
  return findCart
}); */