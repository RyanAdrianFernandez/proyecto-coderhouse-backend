import express, { query } from "express";
import ProductManager from "./Class/productManager.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars"
import homeRouter from "./routes/home.router.js"
import realTimeRouter from "./views router/realtimeproducts.router.js";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import userCarts from "./models/userCarts.model.js";

const app = express();

const httpServer = app.listen(8080, ()=>{
    console.log("Servidor listo!")
});

const io = new Server(httpServer);

// Seteamos middleware arriba de todo para no tener problemas con el routes
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))

//Config del engine views de Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars" )

// Routes
app.use("/", homeRouter);
app.use("/", realTimeRouter);
app.use("/", productsRouter)
app.use("/", cartRouter)

// PRODUCTOS
export const productManager = new ProductManager(__dirname + "/data/product.json");

// SOCKET
io.on("connection", async (socket) =>{
    console.log("Nueva conexion!")
    const productList = await productManager.getProductList()
    socket.emit("home", productList);
    socket.emit("realtime", productList);
    socket.on("nuevoProducto", async producto =>{
        await productManager.addProduct(producto)
        io.emit("realtime", productList)
    })
    socket.on("eliminarProducto", async id =>{
                productManager.deleteProduct(id)
                io.emit("realtime", productList)
            
         
    })
    
})

// Conectando a Mongoose Atlas
mongoose.connect("mongodb+srv://RyanFernandez:pYR2gfsQ9KB6HD2o@coderback.cfohy9d.mongodb.net/BBDD_E-commerce?retryWrites=true&w=majority&appName=CoderBack").then(()=>{
    console.log("Conectado a BBDD")
})

// Agregando el id del carrito al usuario

const addId = async (userId, cartId)=>{
    const usuario = await userCarts.findById({_id: userId }).populate("carts.cart")
    usuario.carts.push({cart: cartId})
    await userCarts.updateOne({_id: "66b223a4a8af88cd8cfd4044"}, usuario)
}

//addId("66b6dea7a14d0d579bbd3893", "66b225234a5b0c20ada4aa18")
//const usuario = await userCarts.findById({_id: "66b223a4a8af88cd8cfd4044"})
// console.log(JSON.stringify(usuario, null, "\t"))
