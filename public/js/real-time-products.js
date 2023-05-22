const socket = io();

const getDeleteBtns = document.getElementsByClassName("deleteButton");
/* const getInput = document.getElementById("inputId"); */

for (let i = 0; i < getDeleteBtns.length; i++) {
  getDeleteBtns[i].addEventListener("click", function () {
    let id = this.getAttribute("data-id");
    // Aquí puedes utilizar el ID para realizar la acción deseada
    socket.emit("productIdToBeRemoved", id);
    console.log("Product with id: " + id + " was deleted succesfuly, please refresh (F5)")
});
}

socket.on("productDeleted", (prodDeleted) => {
  products = prodDeleted;
});

/* getInput.addEventListener("input", () => {
  const msj = getInput.value;
  socket.emit("msj", msj);
});

socket.on("msj", (data) => {
  getDiv.textContent = data;
});
 */