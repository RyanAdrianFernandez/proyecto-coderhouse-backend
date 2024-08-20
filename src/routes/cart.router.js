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
cartRouter.post('/prueba/:cid/product/:pid', async (req, res) => {
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
cartRouter.get("/api/carts/:cid", async (req, res)=>{
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