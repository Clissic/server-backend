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

/*   Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: '<a href="">Why do I have this issue?</a>',
    allowOutsideClick: false
  }) */