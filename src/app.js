import express, { query } from "express";
import ProductManager from "./Class/productManager.js";
import { __dirname } from "./utils.js";
import CartManager from "./Class/cartManager.js";

// POST => Guardar
// GET => Obtener
// PUT => Actualizar/Modificar
// DELETE => Eliminar/Sacar

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// PRODUCTOS
const productManager = new ProductManager(__dirname + "/data/product.json");
const cartManager = new CartManager(__dirname + "/data/cart.json")

// Guardar
app.post("/products", async (req, res)=>{
    
    const agregarProducto = await productManager.addProduct(
        {
            id: 0,
            title: "zapatillas",
            description: "Gibson Les Paul",
            code: "3552",
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
    res.json({updateFile: "Capo no podes cambiar el ID"})
})

// Obtener
app.get("/api/products", async (req, res)=>{
    const productList = await productManager.getProductList()
    res.status(201).json({resultado: productList})

    res.status(203).json({respuesta: "Actualizado"})
})

// Obtener por Id
app.get("/products/:pid", async (req, res)=>{

    const {pid} = req.params;
    const productFind = await productManager.getProductById(pid);
    if(productFind){
        res.status(201).json({resultado: productFind})
    }
    res.status(404).json({resultado: "Not found"})
    
})

// Eliminar producto
app.delete("/:pid", async (req, res)=>{
    const {pid} = (req.params);
    await productManager.deleteProduct(pid)

    res.status(203).json({message: "Producto Eliminado", id: pid})
})

// Cart
// Guardar

app.post("/carts", async (req, res)=>{
    const agregarCart = await cartManager.addCart(
        {
            id: 0,
            products: [
                {"id": 1, "products": [{"id": "id arroz", "quantity": 1 }]}
            ]
        }
    )
    if(agregarCart === true){
        console.log(agregarCart);
        res.status(201).json({
            respuesta: "Agregado al cart!"
        })
    }

})

//Obtener productos del cart seleccionado
app.get("/carts/cid", async (req, res)=>{
    const {cid} = req.params;
    const cartList = await cartManager.getProductById(cid)
    res.status(201).json({resultado: cartList})

    res.status(203).json({respuesta: "Los productos son: "})
})

//Guardar: agregar el producto al arreglo “products” del carrito seleccionado
app.post("/:cid/product/:pid", async (res, req)=>{
    const {cid, pid} = req.params

    // mi metodo await cartManager.addProductOnCart(cid, pid)
})

app.listen(8080, ()=>{
    console.log("Servidor listo!")
}) 
