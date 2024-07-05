import fs from "node:fs"
import { type } from "node:os";

class CartManager{
    constructor(path){
        this.path = path;
        this.cartList = [];
    }

    async getProductById(id){
        await this.getProductList()

        return this.productList.find(product => product.id == id)
    }

    async updateProduct(producto, updateProduct){
        // Hacer la logica para actualizar el producto
        const modificacion = Object.keys(updateProduct)
        const claveId = Object.keys(producto)

        const verificarId = claveId.find(clave => clave == modificacion)
        if(verificarId !== "id"){
            const objetoActualizado = { ...producto, ...updateProduct };

        await this.getProductList()

        const index = this.productList.findIndex(p => p.id === producto.id);

        if (index !== -1) {
            // Actualizar el producto en this.productList
            this.productList[index] = objetoActualizado;

            // Escribir los datos actualizados de nuevo al archivo JSON
            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }, null, 2));

            return updateProduct;
        }
        await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}))
        return objetoActualizado
        } 
        
        
    }
    
    async deleteProduct(id){

        const data = await fs.promises.readFile(this.path, "utf-8")
        const jsonData = JSON.parse(data);
        const idPasadoANumero = parseInt(id)

        const findProducto = jsonData.data.findIndex( objeto => objeto.id === idPasadoANumero)
        if(findProducto !== -1) {
            jsonData.data.splice(findProducto, 1);
            this.productList = jsonData.data;
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}))
            console.log("Eliminado con exito!")
        } else{
            console.log("No encontrado")
        }
    }

    async getCartList(){
        const list = await fs.promises.readFile(this.path, "utf-8")
        this.productList = [...JSON.parse(list).data]
        return [...this.productList]
    }

    async addCart(products){
        const data = await fs.promises.readFile(this.path, "utf-8")
        const jsonData = JSON.parse(data);

        await this.getCartList()

        const idAnterior = this.productList.length;
        products.id = idAnterior + 1;

        const listaDeCodes = []
        
        for(let i=0; i<jsonData.data.length; i++){
            listaDeCodes.push((jsonData.data[i].id))
        }
        
        const verificarCode = listaDeCodes.includes(products.id)
        if(verificarCode !== true){
            this.cartList.push(products)
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.cartList}))
        } else{
            
            return verificarCode
        }
        
    }

}

/*          
                
*/

export default CartManager;

/*

    constructor...

    {
        "data":
            [{"id": 1, "products": [{"id": "id arroz", "quantity": 1 }],
            [{"id": 2, "products": [{"id": "id fideos", "quantity": 3}]}]
        }]
    }

    async addProductOnCart(cid, pid){
        Recupera lo que tenga del archivo y guardalo en this.carList
        this.carts.map(
            if(cart.id !=== cid){
                return cart
            } else {
                const indexProduct = cart.products.findIndex(products => products.id === pid)
                if(indexProduct === -1){
                    cart.product.push(({id: "id del producto nuevo", quantity: 1}))
                    return cart
                }
                
                cart.products[indexProduct] = {...cart.products[indexProduct], quantity: cart.products[indexProduct].quantity + 1}
                return cart

                writefile(this.path del cart, Json.stingify({data: [...cartUpdated]}))
            }
        )
    }


 */