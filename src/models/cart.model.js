import mongoose from "mongoose";
const cartCollection = "carritos"

const cartSchema = new mongoose.Schema({
    products: { 
        type: [
            {
                quantity: {
                    type: Number,
                    default: 0
                },
                productos:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ],
        default: []
    }
})

const cart = mongoose.model(cartCollection, cartSchema)
export default cart;