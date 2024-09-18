import express, { query } from "express";
import ProductManager from "./Class/productManager.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars"
import homeRouter from "./routes/home.router.js"
import registerRouter from "./routes/register.router.js";
import loginRouter from "./routes/login.router.js";
import perfilRouter from "./routes/perfil.router.js";
import realTimeRouter from "./views router/realtimeproducts.router.js";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import sessionsRouter from "./routes/sessions.route.js";
import userCarts from "./models/userCarts.model.js";
import productsRenderRouter from "./views router/productsRender.router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store"
import MongoStore from "connect-mongo";
import { connectionDB } from './mongo/connection.js';
import dotenv from 'dotenv';
import passport from 'passport';
import initializePassport from './passport/jwt.passport.js';

const app = express();
// const fileStore = FileStore(session) // Libreria para manejar las sesiones, nos devuelve un objeto

const httpServer = app.listen(8080, ()=>{
    console.log("Servidor listo!")
});
app.listen(process.env.PORT, () => {
    console.log('Servidor en 8080')
});

const io = new Server(httpServer);
dotenv.config();
connectionDB();
initializePassport();
// Seteamos middleware arriba de todo para no tener problemas con el routes
app.use(express.static(__dirname + "/public"));
app.use(cookieParser(process.env.SECRET));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use('/', router);

// Cookies/Sessions------------------------------------------------
app.use(session({
    // Config de las Sessions
    /*store: new fileStore({ // Instanciamos el fileStore
        // Config de la Store
        path: "./src/session",
        ttl: 15, // Tiempo de vida en SEGUNDOS no milisegundos
        retries: 1 // La cantidad de veces que va a ir a buscar el archivo session
    }),*/
    // En vez de usar fileStore, usamos mongo atlas ya que sino se nos acumulan las sesiones expiradas.
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://RyanFernandez:pYR2gfsQ9KB6HD2o@coderback.cfohy9d.mongodb.net/BBDD_E-commerce?retryWrites=true&w=majority&appName=CoderBack",
        dbName: "users",
        ttl: 3600
    }),
    secret: "SECRETO", // El hash o clave con la que se reconoce 
    resave: true, // Luego de x tiempo se cierra la sesión
    saveUninitialized: false, // Si hay sesión pero esta vacia sin loguear se guarda en true o no en false
    cookie: {
        maxAge: 120000,
        // httpOnly: true, // Esto no le permite al cliente acceder al js
        // secure: true // Solo va a trabajar con HTTPS Seguro
    }
}))

//Config del engine views de Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars" )

// Routes
app.use("/", homeRouter);
app.use("/", realTimeRouter);
app.use("/", productsRouter)
app.use("/", cartRouter)
app.use("/", productsRenderRouter)
app.use("/", registerRouter)
app.use("/", loginRouter)
app.use("/", perfilRouter)
app.use("/api/sessions/", sessionsRouter)



// Probando Cookies
/*
app.get("/setCookies", (req, res)=>{
    res.cookie("Mi primera cookie", "clase 1 de coder back II", {maxAge: 60000}).send("cookie")
})

app.get("/getCookies", (req, res)=>{
    res.send(req.cookies)
})*/

/*
// Probando Session
app.get("/session", (req, res)=>{
    // req.session es un objeto que va a almacenar info que va a vivir en cada request
    if(!req.session.isFirst){
        req.session.isFirst = true
        res.send("Bienvenido! Esta es tu primera vez")
    }else{
        res.send("Ya estuviste por aca...")
    }
})

app.get("/deleteSession", (req, res)=>{
    // Para eliminar una session
    req.session.destroy((error)=>{
        if(error) res.send("No se puedo eliminar la session")
        res.send("Session destruida")
    })
})


const USERS = [{
    nombre: "Pepito",
    rol: "admin"
},
{
    nombre: "Jose",
    rol: "superAdmin"
}
]

app.get("/login/:usuario", (req, res)=>{
    const { usuario } = req.params
    const userFind = USERS.find(user => user.nombre === usuario)
    if(!userFind){
        req.session.username = usuario
        req.session.rol = "invitado"
        return res.send("Bienvenido invitado")
    }

    req.session.username = userFind.nombre
    req.session.rol = userFind.rol
    res.send("Bienvenido " + userFind.nombre + " " + userFind.rol )
})

*/
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
mongoose.connect("mongodb+srv://RyanFernandez:pYR2gfsQ9KB6HD2o@coderback.cfohy9d.mongodb.net/BBDD_E-commerce?retryWrites=true&w=majority&appName=CoderBack", {dbName: "users"}).then(()=>{
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
