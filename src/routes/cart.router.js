import express from "express"

const cartRouter = express.Router()
import userCarts from "../models/userCarts.model.js"
import cart from "../models/cart.model.js"

// Cart
// Guardar

cartRouter.post("/api/carts/", async (req, res)=>{
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
cartRouter.get("/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const cartList = await cartManager.getProductById(cid)

    if(cartList !== undefined){
        res.status(201).json({cartList})
    } else{
        res.status(404).json({resultado: "Not found"})
    }
    
})

//Guardar: agregar el producto al arreglo “products” del carrito seleccionado
cartRouter.post("/:cid/product/:pid", async (res, req)=>{
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
cartRouter.post("/api/carts/:cid/products/:pid", async (req, res)=>{
    const {cid, pid} = req.params
    const carrito = await cart.findById({_id: cid});
    carrito.products.push({productos: pid});
    await cart.updateOne({_id: cid}, carrito)
    res.send({status: "Producto Agregado", payload: carrito});
})

// Ver productos del cart con populate
cartRouter.get("/api/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const carritoNuevo = await cart.find({_id: cid}).populate("products.productos");
    res.send({status: "Producto Agregado", payload: carritoNuevo});
})

// Crear Delete api/carts/:cid/products/:pid debera eliminar del carrito el producto seleccionado
cartRouter.delete('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const obtenerCart = await cart.find({_id: cid})

        for(let i = 0; i<obtenerCart.length; i++) {
            if(obtenerCart[i].products[0].productos === pid) {
                console.log("Encontrado")
            } else {
                console.log("No encontrado")
            }
        }

        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart or product not found' });
        }

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error removing product from cart', details: error.message });
    }
});
// Crear Put api/carts/:cid actualizar el cart con un array de productos
cartRouter.put("/api/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const dataUpdate = req.body;
    const result = await cart.find({_id: cid}).populate("products.productos");
    const actualizacion = await cart.findByIdAndUpdate(cid, dataUpdate, {new: true});
    res.send({status: "Producto Actualizado", payload: result})
})
// Crear Put api/carts/:cid/products/:pid actualizar el quantity que deseamos

// Delete eliminar todos los productos del carrito

// Hacer populate de el cart con los productos, para ver el id y al desglosar ver los productos

// Modificar el index.handlebars para ver en /products los productos con su respectiva paginacion
// 2 opciones:
//  - Hacer que cuando le de click al producto me lleve a una nueva pagina con el detalle y un boton para 
//    agregar al cart
//  - Poner un boton directamente en cada producto para agregar al cart

// Agregar una vista en /carts/:cid(idDelCart) para visualizar el cart con sus productos agregados

// Obtener del carrito
cartRouter.get("/api/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const result = await cartModel.findById(cid)
    res.send({status: "Producto obtenido", payload: result})
})

// Acutalizar carrito
cartRouter.put("/api/carts/:cid", async (req, res)=>{
    const {cid} = req.params;
    const dataUpdate = req.body;
    const result = await cartModel.findByIdAndUpdate(cid, dataUpdate, {new: true});
    res.send({status: "Producto Actualizado", payload: result})
})

// Eliminar del carrito por id


// Agregar Delete para eliminar todos los productos del carrito
cartRouter.delete("/carts/:pid", async (req, res)=>{
    const {pid} = req.params;
    const result = await cartModel.delete();
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

export default cartRouter