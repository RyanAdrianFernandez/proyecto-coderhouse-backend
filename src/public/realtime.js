const socket = io()

const productosRealTime = document.querySelector("#productosRealTime")
const idModificar = document.querySelector("#idModificar")
const idDelete = document.querySelector("#idAEliminar")

socket.on("realtime", (data)=>{
    productosRealTime.innerHTML = "";
    data.forEach(product =>{
        const div = document.createElement("div")
        div.classList.add("producto")
        const id = document.createElement("p");
        id.innerText = "id: " + product.id;
        const title = document.createElement("p")
        title.innerText = "Titulo: " + product.title;
        const description = document.createElement("p");
        description.innerText = "Descripcion: " + product.description;
        const price = document.createElement("p");
        price.innerText = "Precio: " + product.price;
        const code = document.createElement("p");
        code.innerText = "Codigo: " +product.code;
        const stock = document.createElement("p");
        stock.innerText = "Stock: " +product.stock;
        const category = document.createElement("p");
        category.innerText = "Categoria: " +product.category;

        div.appendChild(id)
        div.appendChild(title)
        div.appendChild(description)
        div.appendChild(price)
        div.appendChild(code)
        div.appendChild(stock)
        div.appendChild(category)
        productosRealTime.appendChild(div)
    })
})

const addProduct = ()=>{
    const title = document.querySelector("#add-title").value
    const description = document.querySelector("#add-description").value
    const price = document.querySelector("#add-price").value
    const code = document.querySelector("#add-code").value
    const stock = document.querySelector("#add-stock").value
    const category = document.querySelector("#add-category").value

    // si todos los parametros se cumplen, agregar el producto
    if(title !== "" && description !== "" && price !== "" && code !== "" && stock !== "" && category !== "" ){
        const info = {title, description, price, code, stock, category}
        socket.emit("nuevoProducto", info)
    } else {
       alert("Todos los campos del formulario deben estar completados")
    }
   
    

    document.querySelector("#add-title").value = ""
    document.querySelector("#add-description").value = ""
    document.querySelector("#add-price").value = ""
    document.querySelector("#add-code").value = ""
    document.querySelector("#add-stock").value = ""
    document.querySelector("#add-category").value = ""
}

const updateProduct = ()=>{
    socket.emit("modificarProducto", idModificar.value)
}


const deleteProduct = ()=>{
    socket.emit("eliminarProducto", idDelete.value)
}