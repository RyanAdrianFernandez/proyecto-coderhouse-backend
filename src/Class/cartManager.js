import fs from "node:fs";
import { type } from "node:os";

class CartManager{
    constructor(path){
        this.path = path;
        this.cartList = [];
    }

    async getProductById(cid){
        await this.getCartList()
        
        return this.cartList.find(product => product.id == cid)
    }

    async addCart(products){
        const data = await fs.promises.readFile(this.path, "utf-8")
        const jsonData = JSON.parse(data);

        await this.getCartList()

        
        const idAnterior = this.cartList.length;
        products.id = idAnterior + 1;

        const listaDeId = []
        
        for(let i=0; i<jsonData.data.length; i++){
            listaDeId.push((jsonData.data[i].id))
        }
        console.log(products.id)
        const verificarCode = listaDeId.includes(products.id)
        if(verificarCode !== true){
            this.cartList.push(products)
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.cartList}))
            return true
        } else{
            return verificarCode
        }
        
    }

    async mostrarConsola(text){
        return text 
    }

    async addProductOnCart(cid, product){
        const data = await fs.promises.readFile(this.path, "utf-8")
        const jsonData = JSON.parse(data);

        await this.getCartList()

        
        const idAnterior = this.cartList.length;
        products.id = idAnterior + 1;

        const listaDeId = []
        
        for(let i=0; i<jsonData.data.length; i++){
            listaDeId.push((jsonData.data[i].id))
        }
        console.log(products.id)
        const verificarCode = listaDeId.includes(products.id)
        if(verificarCode !== true){
            this.cartList.products.push(products)
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.cartList}))
            return true
        } else{
            return verificarCode
        }
        
    }
}

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