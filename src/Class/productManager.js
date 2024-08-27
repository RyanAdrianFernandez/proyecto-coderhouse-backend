import fs from "node:fs"

class ProductManager{
    constructor(path){
        this.path = path;
        this.productList = [];
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

    async getProductList(){
        const list = await fs.promises.readFile(this.path, "utf-8")
        this.productList = [...JSON.parse(list).data]
        return [...this.productList]
    }

    async addProduct(product){
        const data = await fs.promises.readFile(this.path, "utf-8")
        const jsonData = JSON.parse(data);

        await this.getProductList()
        const idAnterior = this.productList.length;
        product.id = idAnterior + 1;

        const listaDeCodes = []
        
        for(let i=0; i<jsonData.data.length; i++){
            listaDeCodes.push((jsonData.data[i].code))
        }
        
        const verificarCode = listaDeCodes.includes(product.code)
        if(verificarCode !== true){
            this.productList.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}))
        } else{
            return verificarCode
        }
        
    }

}

/*          
                
*/

export default ProductManager;