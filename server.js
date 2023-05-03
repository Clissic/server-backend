const express = require("express")
const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))

app.get("/products", (req, res) => {
    res.json(`<h1 style='color: blue'>Hola Mundo</h1>`)
})

app.get("/usuario", (req, res) => {
    const usuario = {nombre: "Joaquin", apellido: "Perez", edad: 31, email: "joaquin.perez.coria@gmail.com"}
    res.json(usuario)
})

app.listen(PORT, () => {
    console.log(`Example app listenind on port ${PORT}`)
})