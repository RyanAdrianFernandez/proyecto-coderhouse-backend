import express from "express";
import ProductManager from "../Class/productManager.js";
import { __dirname } from "../utils.js";
import { productsModels } from "../models/products.model.js";
const productsRouter = express.Router();
export const productManager = new ProductManager(__dirname + "/data/product.json");

// PRODUCTOS
// Guardar a un JSON local 
productsRouter.post("/api/products/", async (req, res)=>{
    
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
productsRouter.put("/:pid", async (req, res)=>{
    const {pid} = req.params;
    const updateFile = req.body;
    const productFind = await productManager.getProductById(pid);
    const updateProduct = await productManager.updateProduct(productFind, updateFile)

    if(updateProduct){    res.status(203).json({updateFile: "Se actualizo correctamente!"})
    }
    res.json({updateFile: "No podes cambiar el ID"})
})

// Obtener por Id
productsRouter.get("/api/products/:pid", async (req, res)=>{

    const {pid} = req.params;
    const productFind = await productManager.getProductById(pid);
    if(productFind !== undefined){
        res.status(201).json({resultado: productFind})


    }else{
        res.status(404).json({resultado: "Not found"})
    }
    
})

// Eliminar producto
productsRouter.delete("/:pid", async (req, res)=>{
    const {pid} = (req.params);
    await productManager.deleteProduct(pid)

    res.status(203).json({message: "Producto Eliminado", id: pid})
})

// En Mongo Atlas
// Crear producto en la bbdd
productsRouter.post("/products", async (req, res)=>{
    
    const {title, description, code, price, status, stock, category, thumbnail} = req.body

    const result = await productsModels.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    })
    res.send({status: "success", payload: result})
})

//Obtener todos los productos en la bbdd
productsRouter.get("/products", async (req, res)=>{
    const result = await productsModels.find()
    res.send({status: "Todos los productos obtenidos", payload: result})
})

// Obtener producto por ID en la bbdd
productsRouter.get("/products/:pid", async (req, res)=>{
    const {pid} = req.params;
    const result = await productsModels.findById(pid)
    res.send({status: "Producto obtenido", payload: result})
})

// Obtener producto y modificarlo en la bbdd
productsRouter.put("/products/:pid", async (req, res)=>{
    const {pid} = req.params;
    const dataUpdate = req.body;
    const result = await productsModels.findByIdAndUpdate(pid, dataUpdate, {new: true});
    res.send({status: "Producto Actualizado", payload: result})
})

// Eliminar producto por ID en la bbdd
productsRouter.delete("/products/:pid", async (req, res)=>{
    const {pid} = req.params;
    const result = await productsModels.findByIdAndDelete(pid);
    res.send({status: "Producto Eliminado", payload: result})
})

// Agregar con Agregation a la bbdd (para obtener reports, etc)
productsRouter.post("/agregation/products", async (req, res)=>{
    const productos = await productsModels.find();
    console.log(productos)
    const order = await productsModels.aggregate([
        {
                $group: { 
                    _id:"$category",
                    cantidadDeCategorias: { $count: {} } 
                }
        }
        
        ])
    console.log(order)
    res.send({status: "Productos filtrados", payload: order})
})

// Modificando el GET para la entrega Final
productsRouter.get("/api/products", async (req, res) => {
    try{
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      let category = req.query.category // Filtrar por categoría
      let status = req.query.status // Filtrar por disponibilidad, true/false
      let orden = req.query.orden // Ordenar el precio asc/desc, sort
      let filtro = {}
      // Filtrar por elemento si existe el query
      
        if (category) {
            filtro.category = category;
      }

      // Filtrar por status si se proporciona
      if(status){
        if(status !== "false" && status !== "true") {
            res.send("No se encontro el producto")
        }else if (status=== "true") {
            filtro.status = true;
        }else if(status === "false") {
        filtro.status = false;
      } 
    }
      
      const opciones = {
        page,
        limit
      }
      if (orden === 'asc' || orden === 'desc') {
        // Convertir 'asc'/'desc' a 1/-1 para el ordenamiento
        const direccion = orden === 'asc' ? 1 : -1;
        opciones.sort = { price: direccion };
    }

    let productos = await productsModels.paginate(filtro, opciones)
      res.status(200).json({status: "Success", payload: productos})
    }
    catch{err=>res.status(500).send(err)}
})


export default productsRouter