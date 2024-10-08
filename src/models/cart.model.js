import mongoose from "mongoose";
const cartCollection = "carritos"
import mongoosePaginate from "mongoose-paginate-v2"
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

cartSchema.plugin(mongoosePaginate)
const cart = mongoose.model(cartCollection, cartSchema)
export default cart;