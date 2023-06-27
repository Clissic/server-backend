import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import session from "express-session";
import { __dirname } from "./config.js";
import { cartRouter } from "./routes/cart.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { products } from "./routes/products.html.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProducts } from "./routes/real-time-products.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { connectMongo } from "./utils/db-connection.js";
import { connectSocketServer } from "./utils/sockets-server.js";
import pkg from 'session-file-store';
import MongoStore from "connect-mongo";
import { loginRouter } from "./routes/login.html.routes.js";
import { signupRouter } from "./routes/signup.html.routes.js";
import { sessionsRouter } from "./routes/session.routes.js";

const app = express();
const PORT = 8080;
const fileStore = pkg(session);
connectMongo();

/* app.use(cookieParser("A98dB973kWpfAF099Kmo")) */
app.use(session({
  secret: "A98dB973kWpfAF099Kmo", 
  resave: true, 
  saveUninitialized: true, 
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://joaquinperezcoria:${process.env.MONGODB_PASSWORD}@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority`,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 15
  })
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// CONFIG DEL MOTOR DE PLANTILLAS:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

const httpServer = app.listen(PORT, () => {
  console.log(
    `App running on ${__dirname} - server http://localhost:${PORT}`
  );
});

connectSocketServer(httpServer);

app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/", loginRouter)
app.use("/signup", signupRouter)
app.use("/products", products);
app.use("/chat", chatRouter);
app.use("/realtimeproducts", realTimeProducts);
app.use("/cart", cartRouter);

// ORDENAR LOGICA DEL SESSION:

app.get("/session", (req, res) => {
  console.log(req.session)
  if (req.session.cont) {
    req.session.cont++
    res.send("Nos visitaste " + req.session.cont)
  } else {
    req.session.cont = 1
    res.send("Nos visitaste " + 1)
  }
})

app.get("/login", (req, res) => {
  const {userName, password} = req.query
  if (userName !== "pepe" || password !== "pepepass") {
    return res.send("Login failed")
  }
  req.session.user = userName
  req.session.admin = false
  res.send("Login success!")
})

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ status: "error", msg: "Logout error", body: err})
    }
    res.send("Logout ok!")
  })
})

app.get("/open", (req, res) =>{
  res.send("Public information")
})

function checkLogin (req, res, next) {
  if (req.session.user) {
    return next()
  } else {
    return res.status(401).send("Authorization error!")
  }
}

app.get("/profile", checkLogin, (req, res) =>{
  res.send("Complete profile")
})

app.get("*", (req, res) => {
  return res
    .status(404)
    .render("404")
});
