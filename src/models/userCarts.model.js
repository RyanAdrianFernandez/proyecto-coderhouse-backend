// Hacer el Schema del cart
import mongoose from "mongoose"

const cartCollection = "usuarios"

const useSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    numero_de_tarjeta: Number, 
    carts : {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carritos'
                }
            }
        ],
        default: []
    }
})

useSchema.pre("find", function(){
    this.populate("carts.cart")
})

const userCarts = mongoose.model(cartCollection, useSchema)
export default userCarts