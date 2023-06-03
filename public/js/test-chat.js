const socket = io();

const chatBox = document.getElementById("input-msg");
let usuarioIngresado = "";

async function main() {
  const { value: nombre } = await Swal.fire({
    title: "Enter your name:",
    input: "text",
    inputLabel: "Your name is...",
    inputValue: "",
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  usuarioIngresado = nombre;
}

main();
function scrollDivToBottom() {
  const divMsgs = document.getElementById("div-msgs");
  divMsgs.scrollTop = divMsgs.scrollHeight;
}

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_to_back", {
      msg: chatBox.value,
      user: usuarioIngresado,
    });
    chatBox.value = "";
    scrollDivToBottom();
  }
});

socket.on("listado_de_msgs", (msgs) => {
  console.log(msgs);
  const divMsgs = document.getElementById("div-msgs");
  let formato = "";
  msgs.forEach((msg) => {
    formato = formato + 
    `
    <div class="indMsgBox">
      <p class="indMsgUser">${msg.user}:</p>
      <p>${msg.msg}</p>
    </div>
    `;
  });
  divMsgs.innerHTML = formato;
  scrollDivToBottom();
});

scrollDivToBottom();