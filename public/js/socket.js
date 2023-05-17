const socket = io();

const getDiv = document.getElementById("divId")
const getInput = document.getElementById("inputId")

getInput.addEventListener("input", () => {
    const msj = getInput.value
    socket.emit("msj", msj)
})

socket.on("msj", (data) => {
    getDiv.textContent = data
})