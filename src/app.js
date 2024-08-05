import express, { query } from "express";
import ProductManager from "./Class/productManager.js";
import { __dirname } from "./utils.js";
import CartManager from "./Class/cartManager.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars"
import homeRouter from "./routes/home.router.js"
import realTimeRouter from "./views router/realtimeproducts.router.js";
// POST => Guardar
// GET => Obtener
// PUT => Actualizar/Modificar
// DELETE => Eliminar/Sacar

const app = express();
const httpServer = app.listen(8080, ()=>{
    console.log("Servidor listo!")
});
const io = new Server(httpServer);


//Config del engine views de Handlebars

app.engine("handlebars", handlebars.engine())
// Seteamos para poder usarlo
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars" )
app.use(express.static(__dirname + "/public"))
app.use("/", homeRouter);
app.use("/", realTimeRouter);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// PRODUCTOS
export const productManager = new ProductManager(__dirname + "/data/product.json");
const cartManager = new CartManager(__dirname + "/data/cart.json")
// Guardar
app.post("/api/products/", async (req, res)=>{
    
    const agregarProducto = await productManager.addProduct(
        {
            id: 0,
            title: "zapatillas",
            description: "Gibson Les Paul",
            code: "wdas",
            price: 2500,
            status: true,
            stock: 100,
            category: "guitar",
            thumbnail: ""
         }, 1
        )
    if(agregarProducto === true){
        res.json({error: "Capo ese code ya existe!"})
    }else{
        res.status(201).json({mesage: "Añadido!"})
    }
    
   
})

// Actualizar
app.put("/:pid", async (req, res)=>{
    const {pid} = req.params;
    const updateFile = req.body;
    const productFind = await productManager.getProductById(pid);
    const updateProduct = await productManager.updateProduct(productFind, updateFile)

    if(updateProduct){    res.status(203).json({updateFile: "Se actualizo correctamente!"})
    }
    res.json({updateFile: "No podes cambiar el ID"})
})

// Obtener
app.get("/api/products", async (req, res)=>{
    const productList = await productManager.getProductList()
    res.status(201).json({resultado: productList})

    res.status(203).json({respuesta: "Actualizado"})
})

// Obtener por Id
app.get("/api/products/:pid", async (req, res)=>{

    const {pid} = req.params;
    const productFind = await productManager.getProductById(pid);
    if(productFind !== undefined){
        res.status(201).json({resultado: productFind})


    }else{
        res.status(404).json({resultado: "Not found"})
    }
    
})

// Eliminar producto
app.delete("/:pid", async (req, res)=>{
    const {pid} = (req.params);
    await productManager.deleteProduct(pid)

    res.status(203).json({message: "Producto Eliminado", id: pid})
})

// Cart
// Guardar

app.post("/api/carts/", async (req, res)=>{
    const agregarCart = await cartManager.addCart(
        {
            id: 0,
            products: [
                [{"id": "Zapatos", "quantity": 4 }]
            ]
        }
    )
    if(agregarCart === true){
        res.status(201).json({
            respuesta: "Agregado al cart!"
        })
    }

})

//Obtener productos del cart con id 
app.get("/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const cartList = await cartManager.getProductById(cid)

    if(cartList !== undefined){
        res.status(201).json({cartList})
    } else{
        res.status(404).json({resultado: "Not found"})
    }
    
})

//Guardar: agregar el producto al arreglo “products” del carrito seleccionado
app.post("/:cid/product/:pid", async (res, req)=>{
    const {cid, pid} = req.params

    const addProductOnCart = await cartManager.addProductOnCart(
        cid, 
        {
            id: 0,
            products: [
                [{"id": "Zapatos", "quantity": 4 }]
            ]
        }
    )
    
})

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


