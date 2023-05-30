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
  const productsDeletedParse = JSON.parse(prodDeleted)
  const realTimeProds = document.getElementById("realTimeProds").innerHTML = productsDeletedParse.reduce((acc, prod) => {
    return acc + 
    `
    <div class="realTimeProd">
      <div class="realTimeProdParams">
        <p class="realTimeProdId">Id: ${prod.id}</p>
        <p class="realTimeProdThumbnail">Thumbnail: <a target="_blank" href="${prod.thumbnail}">Product img</a></p>
        <p class="realTimeProdTitle">Name: ${prod.title}</p>
        <p class="realTimeProdPrice">Price: ${prod.price}</p>
        <p class="realTimeProdDesc">Description: ${prod.description}</p>
        <p class="realTimeProdCode">Code: ${prod.code}</p>
        <p class="realTimeProdCategory">Category: ${prod.category}</p>
        <p class="realTimeProdStock">Stock: ${prod.stock}</p>
        <p class="realTimeProdStatus">Status: ${prod.status}</p>
      </div>
      <button id="realTimeDeleteButton" data-id="${prod.id}" class="deleteButton">Delete</button>
    </div>
    `
  },"")
});

// AGREGAR UN PRODUCTO CON WEBSOCKETS
getAddProductSubmitBtn.addEventListener("click", (event) => {
  event.preventDefault()

  let thumbnail = document.getElementById("thumbnail").value;
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
  const newProductsParsed = JSON.parse(newProducts)
  document.getElementById("realTimeProds").innerHTML = newProductsParsed.reduce((acc, prod) => {
    return acc + 
    `
    <div class="realTimeProd">
      <div class="realTimeProdParams">
        <p class="realTimeProdId">Id: ${prod.id}</p>
        <p class="realTimeProdThumbnail">Thumbnail: <a target="_blank" href="${prod.thumbnail}">Product img</a></p>
        <p class="realTimeProdTitle">Name: ${prod.title}</p>
        <p class="realTimeProdPrice">Price: ${prod.price}</p>
        <p class="realTimeProdDesc">Description: ${prod.description}</p>
        <p class="realTimeProdCode">Code: ${prod.code}</p>
        <p class="realTimeProdCategory">Category: ${prod.category}</p>
        <p class="realTimeProdStock">Stock: ${prod.stock}</p>
        <p class="realTimeProdStatus">Status: ${prod.status}</p>
      </div>
      <button id="realTimeDeleteButton" data-id="${prod.id}" class="deleteButton">Delete</button>
    </div>
    `
  },"")
})