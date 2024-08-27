import express from "express"

const cartRouter = express.Router()
import userCarts from "../models/userCarts.model.js"
import cart from "../models/cart.model.js"
import CartManager from "../Class/cartManager.js"
import { __dirname } from "../utils.js"

const cartManager = new CartManager(__dirname + "/data/cart.json")
// ==================================================== De forma LOCAL =========================================================
// Agregar al Cart
cartRouter.post("/api/carts/", async (req, res)=>{
    const agregarCart = await cartManager.addCart(
        {
            id: 0,
            products: [
                [{"id": "Guitarras", "quantity": 40 }]
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
cartRouter.get("/api/cartsLocal/:cid", async (req, res)=>{
    const {cid} = req.params;
    const cartList = await cartManager.getProductById(cid)

    if(cartList !== undefined){
        res.status(201).json({cartList})
    } else{
        res.status(404).json({resultado: "Not found"})
    }
    
})

//Guardar: agregar el producto al arreglo “products” del carrito seleccionado
cartRouter.post("/product/:cid", async (req, res)=>{
    const {cid} = req.params;

    const addProductOnCart = await cartManager.addProductOnCart(
        cid, 
        {
            id: 0,
            products: [
                [{"id": 2, "quantity": 4, "title": "Guitarras", "price": 2500 }]
            ]
        }
    )
    res.send({message: "Producto Agregado", payload: addProductOnCart})
    
})
cartRouter.delete("/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const deleteCart = await cartManager.deleteCart(cid)
    if(deleteCart){
        res.status(202).send({message: "Eliminado del carrito", payload: deleteCart})
    } else {
        res.status(400).send({message: "Not Found"})
    }
})

cartRouter.put("/api/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const dataUpdate = req.body;
    const result = await cartManager.updateCart(cid, dataUpdate)
    res.send({status: "Producto Actualizado", payload: result})
})
//======================================================================================


// En Mongo Atlas
// Crear usuario
cartRouter.post("/user", async (req, res)=>{
    
    const {first_name, last_name, email, numero_de_tarjeta} = req.body

    const result = await userCarts.create({
        first_name,
        last_name,
        email,
        numero_de_tarjeta
    })
    res.send({status: "Usuario Creado!", payload: result})
})

// Crear cart en bbdd
cartRouter.post("/cart", async (req, res)=>{
    const result = await cart.create({
    })
    res.send({status: "Cart creado", payload: result})
})

// Agregar producto al array de cart
cartRouter.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cartFinded = await cart.findById(cid);
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const indexProd = cartFinded.products.findIndex(prod => prod.productos.toString() === pid);
    if(indexProd === -1){
        cartFinded.products.push({ productos: pid, quantity: 1 })
    } else {
        cartFinded.products[indexProd] = { productos: cartFinded.products[indexProd].productos, quantity: cartFinded.products[indexProd].quantity + 1 }
    }
    const cartUpdated = await cart.findByIdAndUpdate(cid,cartFinded, {
        new: true,
    }).populate('products.productos')

    res.status(201).json({ message: 'Product Added', cart: cartUpdated})

});


// Ver productos del cart con populate
cartRouter.get("/api/cartsPopulate/:cid", async (req, res)=>{
    const {cid} = req.params;
    const carritoNuevo = await cart.find({_id: cid}).populate("products.productos");
    res.send({status: "Producto Agregado", payload: carritoNuevo});
})

// Crear Delete api/carts/:cid/products/:pid debera eliminar del carrito el producto seleccionado
cartRouter.delete('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cartFinded = await cart.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const cartFiltered = {
        ...cartFinded,
        products:  cartFinded.products.filter(prod => prod.productos.toString() !== pid)
    }

    const cartUpdated = await cart.findByIdAndUpdate(cid,cartFiltered, {
        new: true,
    }).populate('products.productos')

    res.status(201).json({ message: 'Product deleted', cart: cartUpdated})
});

// Crear Put api/carts/:cid actualizar el cart con un array de productos
cartRouter.put('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body

    const cartFinded = await cart.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const newCart = {
        ...cartFinded,
        products
    }
    const cartUpdated = await cart.findByIdAndUpdate(cid,newCart, {
        new: true,
    }).populate('products.productos')

    res.status(201).json({ message: 'Products clean', cart: cartUpdated})

});

// Crear Put api/carts/:cid/products/:pid actualizar el quantity que deseamos
cartRouter.put('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cartFinded = await cart.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const indexProd = cartFinded.products.findIndex(prod => prod.productos.toString() === pid);
    
    cartFinded.products[indexProd] = { ...cartFinded.products[indexProd], quantity }
    
    const cartUpdated = await cart.findByIdAndUpdate(cid,cartFinded, {
        new: true,
    }).populate('products.productos')

    res.status(201).json({ message: 'Product Quantity Modify', cart: cartUpdated })

});

// Delete eliminar todos los productos del carrito
cartRouter.delete('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    const cartFinded = await cart.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ message: 'error' });

    const newCart = {
        ...cartFinded,
        products: []
    }
    const cartUpdated = await cart.findByIdAndUpdate(cid,newCart, {
        new: true,
    })

    res.status(201).json({ message: 'Products clean', cart: cartUpdated})

});

// Obtener del carrito
cartRouter.get("/api/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const result = await cart.find({_id: cid})
    res.send({status: "Producto obtenido", payload: result})
})

// Acutalizar carrito


// Eliminar del carrito por id


// Agregar Delete para eliminar todos los productos del carrito
cartRouter.delete("/api/carts/:pid", async (req, res)=>{
    const {pid} = req.params;
    const result = await cart.findByIdAndDelete({_id: pid});
    res.send({status: "Producto Eliminado", payload: result})
})

// Filtrar carrito con Agregation

cartRouter.get("/agregation/cart", async (req, res)=>{
    const order = await cart.aggregate([
        { 
            $group: {
                _id: "$title",
                totalQuantity: { $sum: "$quantity" }
            }
        },
        {
            $sort: {totalQuantity: -1}
        },
        {
            $group: {_id: 1, orders: {$push: "$$ROOT"}}
        },
        {
            $project: {
                "_id": 0,
                orders: "$orders"
            }
        },
        {
            $merge: {
                into: "reports",
                into: "orders"
            }
        }
    ])
    console.log(order)
    res.send({status: "Cart filtrado", payload: order})


})

cartRouter.get("/api/cartsPaginate", async (req, res) => {
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

    let productos = await cart.paginate(filtro, opciones)
      res.status(200).json({status: "Success", payload: productos})
    }
    catch{err=>res.status(500).send(err)}
})

export default cartRouter