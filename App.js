const express = require("express")
import ProductManager from './ProductManager'

const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))

app.get("/products", (req, res) => {
    let {limit} = req.query;
    if (limit) {
        let i = 0
        while (i !== limit - 1) {
            res.json(products[i])
            i++
        }
    } else {
        res.json(products)
    }
})

app.get("/usuario", (req, res) => {
    const usuario = {nombre: "Joaquin", apellido: "Perez", edad: 31, email: "joaquin.perez.coria@gmail.com"}
    res.json(usuario)
})

app.listen(PORT, () => {
    console.log(`Example app listenind on port ${PORT}`)
})