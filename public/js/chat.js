const socket = io();

const chatBox = document.getElementById("input-msg");
let emailIngresado = "";

async function main() {
  const { value: email } = await Swal.fire({
    title: "Enter your email:",
    input: "text",
    inputLabel: "Your email is...",
    inputValue: "",
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  emailIngresado = email;
}

main();
function scrollDivToBottom() {
  const divMsgs = document.getElementById("div-msgs");
  divMsgs.scrollTop = divMsgs.scrollHeight;
}

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_to_back", {
      message: chatBox.value,
      user: emailIngresado,
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
      <p>${msg.message}</p>
    </div>
    `;
  });
  divMsgs.innerHTML = formato;
  scrollDivToBottom();
});

scrollDivToBottom();